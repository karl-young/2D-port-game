import { dialogueData, scaleFactor } from './constants.js'
import { displayDialogue, setCamScale } from './utils.js'
import { k } from './kaboomCtx.js'

k.loadSprite('spritesheet', './spritesheet.png', {
  sliceX: 39,
  sliceY: 31,
  anims: {
    // this is the character number
    'idle-down': 784,
    'walk-down': { from: 784, to: 785, loop: true, speed: 8 },
    'idle-side': 786,
    'walk-side': { from: 786, to: 787, loop: true, speed: 8 },
    'idle-up': 823,
    'walk-up': { from: 823, to: 824, loop: true, speed: 8 },
  },
})

k.loadSprite('map', './map.png')

k.setBackground(k.Color.fromHex('#046680'))

k.scene('main', async () => {
  const mapData = await (await fetch('./map.json')).json()
  const layers = mapData.layers

  const map = k.add([k.sprite('map'), k.pos(0), k.scale(scaleFactor)])

  const player = k.make([
    k.sprite('spritesheet', { anim: 'idle-down' }),
    k.area({ shape: new k.Rect(k.vec2(0, 3), 10, 10) }),
    k.body(),
    k.anchor('center'),
    k.pos(),
    k.scale(scaleFactor),
    {
      speed: 250,
      direction: 'down',
      isInDialogue: false,
    },
    'player',
  ])

  for (const layer of layers) {
    if (layer.name === 'boundaries') {
      for (const boundary of layer.objects) {
        map.add([
          k.area({
            shape: new k.Rect(k.vec2(0), boundary.width, boundary.height),
          }),
          k.body({ isStatic: true }),
          k.pos(boundary.x, boundary.y),
          boundary.name,
        ])

        if (boundary.name) {
          player.onCollide(boundary.name, () => {
            player.isInDialogue = true
            displayDialogue(
              dialogueData[boundary.name],
              () => (player.isInDialogue = false)
            )
          })
        }
      }

      continue
    }

    if (layer.name === 'spawnpoints') {
      for (const entity of layer.objects) {
        if (entity.name === 'player') {
          player.pos = k.vec2(
            (map.pos.x + entity.x) * scaleFactor,
            (map.pos.y + entity.y) * scaleFactor
          )
          k.add(player)
          continue
        }
      }
    }
  }

  setCamScale(k)

  k.onResize(() => {
    setCamScale(k)
  })

  k.onUpdate(() => {
    k.camPos(player.pos.x, player.pos.y + 100)
  })

  k.onMouseDown((mouseBtn) => {
    if (mouseBtn !== 'left' || player.isInDialogue) return

    const worldMousePos = k.toWorld(k.mousePos())
    player.moveTo(worldMousePos, player.speed)

    const mouseAngle = player.pos.angle(worldMousePos)

    const lowerBound = 50
    const upperBound = 125

    if (
      mouseAngle > lowerBound &&
      mouseAngle < upperBound &&
      player.curAnim() !== 'walk-up'
    ) {
      player.play('walk-up')
      player.direction = 'up'
      return
    }

    if (
      mouseAngle < -lowerBound &&
      mouseAngle > -upperBound &&
      player.curAnim() !== 'walk-down'
    ) {
      player.play('walk-down')
      player.direction = 'down'
      return
    }

    if (Math.abs(mouseAngle) > upperBound) {
      player.flipX = false
      if (player.curAnim() !== 'walk-side') player.play('walk-side')
      player.direction = 'right'
      return
    }

    if (Math.abs(mouseAngle) < lowerBound) {
      player.flipX = true
      if (player.curAnim() !== 'walk-side') player.play('walk-side')
      player.direction = 'left'
      return
    }
  })

  k.onMouseRelease(() => {
    if (player.direction === 'down') {
      player.play('idle-down')
      return
    }
    if (player.direction === 'up') {
      player.play('idle-up')
      return
    }

    player.play('idle-side')
  })
})

k.go('main')

import React, {
    forwardRef,
    useRef,
    useEffect,
    useImperativeHandle
  } from 'react'
  import { useGLTF, useAnimations } from '@react-three/drei'
  import { useFrame } from '@react-three/fiber'
  
  export const AnimatedModel = forwardRef((props, ref) => {
    //@ts-ignore
    const group = useRef()
    const { scene, animations } = useGLTF('/models/plannet6.glb')
    //@ts-ignore
    const { actions, mixer } = useAnimations(animations, group)
  
    useImperativeHandle(ref, () => ({ actions, mixer, scene }))
  
    useEffect(() => {
      console.log('GLTF animations:', animations.map(a => a.name))
      if (animations.length === 0) {
        console.warn(' Жодної анімації не завантажено.')
        return
      }
  
      // Обираємо першу анімацію за назвою
      const clipName = animations[0].name
      const action = actions[clipName]
      if (!action) {
        console.error(`Action "${clipName}" не знайдено у actions`)
        return
      }
      console.log('Запускаємо анімацію:', clipName)
      action
        .reset()
        .fadeIn(0.2)
        .play()
    }, [animations, actions, mixer])
  
    useFrame((_, delta) => {
      mixer.update(delta)
    })
  
    return <primitive ref={group} object={scene} position={[100,-120,-200]} scale={13} />
  })
  
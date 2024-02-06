//now we should attach it in to our windo object 
//const THREE = window.MINDAR.IMAGE.THREE;
//modular 
import * as THREE from 'three';
import { MindARThree} from 'mindar-image-three';
import { loadGLTF } from './loader.js';





document.addEventListener('DOMContentLoaded', () =>{
const start = async() => {
        //instantiate the image 
        const mindarThree = new MindARThree({

            //this constractor take 2 parameters 1.container 2.imageTargetSrc
            //use tis for image target:

        //*****full screen */
            container: document.body,
        //in container
           // container: document.querySelector("#my-ar-container"),
            
            imageTargetSrc: './targets.mind',

            //more than 1 target: traking at the same time
            //maxTrack:2,


        });
        //we need the three js elements here as well but this time insted of using them manually 
        //we can use them this way mindar object
        const {renderer, scene, camera} = mindarThree;

        //LIGHTING
        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 10);
        light.position.set(0,0,3)
        scene.add(light);
        /**********************************************************************************************/
        //we can create geometry our selves 
        /*
        const geometry = new THREE.PlaneGeometry(1,1);
        const material = new THREE.MeshBasicMaterial({color: 0x0000ff, transparent: true, opacity: 0.5});
        const plane = new THREE.Mesh(geometry,material);
        */

        //we need to creat mind ar anchor obj
        //index 0 for single image we can have mor than 1 
        //const anchor = mindarThree.addAnchor(0);

        //use the loadGLTF here
        const heli = await loadGLTF("./scene.gltf");
        //second model
        //const secondModel = await loadGLTF("./modelpath")

        //gltf.scene: THREE.Group
        //modify the model
        heli.scene.scale.set(0.3,0.3,0.3);
        heli.scene.rotation.set(0,0,0);
        heli.scene.position.set(0,0,0);
        
        //anchor (target index)
        
        const heliAnchor = mindarThree.addAnchor(0);
        heliAnchor.group.add(heli.scene);

        //animation (inner) = gltf.animation[animation index] use 3js animation mixer class

        const mixer = new THREE.AnimationMixer(heli.scene);
        const action = mixer.clipAction(heli.animations[0]);
        action.play();
        //now we have to call mixer.update() in evry frame in renderer

        //second
        /*
        const secondModelAnchor = mindarThree.addAnchor(1);
        secondModelAnchor.group.add(secondModel.scene);
        */
        //

        //we adding the plan to this anchor
        //anchor.group.add(plane); //THREE.Group Element (hierarchy of 3d scene: we add an empty group to the scene than we add renderable objects to it)

        //define the time line for animations 
        const clock = new THREE.Clock();
        //start the engine
        //await must use in a syc 
        await mindarThree.start();

        //callback function that execute for every frames
        renderer.setAnimationLoop(()=>{
            //delta is time elapsed since the last time we call this get delta function 
            const delta = clock.getDelta();

            //CODE ANIMATION (just update some property over the time)
            //heli.scene.rotation.set(90, heli.scene.rotation.y + delta, 0)

            //for update animation
            mixer.update(delta);
            renderer.render(scene, camera);

        });
    }
    start();

});
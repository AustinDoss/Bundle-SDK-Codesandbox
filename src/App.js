
import './App.css';

const model = "7VD4WsXHhXD"
const params = "&play=1&tour=0&log=0"

async function handleShowcaseLoad(){
  const showcase_iframe = document.getElementById('showcase_iframe')
    try {
      if (showcase_iframe.contentWindow) {
        let sdk = await showcase_iframe.contentWindow.MP_SDK.connect(showcase_iframe);
        sdk.App.state.subscribe((state) => {
          if (state.phase === sdk.App.Phase.PLAYING) {
            onSdkConnect(sdk);
          }
        })
      }
    } catch (e) {
      console.error(e);
      return;
    }
}

async function onSdkConnect(sdk) {
  console.log(sdk)
  var [sceneObject] = await sdk.Scene.createObjects(1);

  var logoNode = sceneObject.addNode("logoNode");
  var lightNode = sceneObject.addNode("lightNode");

  var logoInitial = {
    url: process.env.PUBLIC_URL + "/assets/Matterport_Logo.gltf",
    visible: true,
    localScale: {
      x: 0.05,
      y: 0.05,
      z: 0.05,
    },
  };
  var logoComponent = await logoNode.addComponent(
    "mp.gltfLoader",
    logoInitial,
    "myLogoComponent"
  );

  var lightInitial = {
    enabled: true,
    color: {
      r: 1,
      g: 1,
      b: 1,
    },
    intensity: 2,
    target: {
      x: 0,
      y: 0,
      z: 0,
    },
    debug: false,
  };
  var lightComponent = await lightNode.addComponent(
    "mp.directionalLight",
    lightInitial,
    "myLightComponent"
  );
  await lightNode.addComponent(
    "mp.ambientLight",
    {
      debug: false,
      intensity: 1,
      color: {
        r: 1,
        g: 1,
        b: 1,
      },
    },
    "ambientLightComponent"
  );

  await sceneObject.start();
  logoNode.obj3D.position.set(2, -1.5, 2.75);
  lightComponent.light.target = logoNode.obj3D;

  const tick = function () {
    requestAnimationFrame(tick);
    logoNode.obj3D.rotation.y += 0.05;
  };
  tick();

  sdk.Scene.configure(function (renderer, THREE, effectComposer) {
    if (true) {
      console.log(effectComposer)
      // effectComposer.passes[0] is the renderPass
      let scene = effectComposer.passes[0].scene;
      let camera = effectComposer.passes[0].camera;
      const outlinePass = new THREE.OutlinePass(
        new THREE.Vector2(128, 128),
        scene,
        camera
      );
      outlinePass.visibleEdgeColor = new THREE.Color(1, 1, 1);
      outlinePass.hiddenEdgeColor = new THREE.Color(1, 1, 1);
      outlinePass.edgeStrength = 4
      outlinePass.edgeGlow = 1
      outlinePass.edgeThickness = 4;
      outlinePass.pulsePeriod = 4;
      outlinePass.selectedObjects = [logoNode.obj3D];
      effectComposer.addPass(outlinePass);
    }
  });
}


function App() {
  return (
    <div className="App">
      <iframe
          title="showcase_iframe"
          id="showcase_iframe"
          src={process.env.PUBLIC_URL + "/mp_bundle/showcase.html?m=" + model + params + "&applicationKey=5n1rihzdbgxus7k1exfne27ac"}
          width="100%"
          height="100%"
          onLoad={handleShowcaseLoad}>
          
        </iframe>
    </div>
  );
}

export default App;

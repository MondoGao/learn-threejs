import * as three from 'three';
import { SpotLight, AnimationAction, log } from 'three';
import * as Stats from '../scripts/stats';
import dat from 'dat.gui';


let app = {
  container: document.getElementById('app'),
  stats: null,
  init() {
    app.stats = Stats();
    app.stats.showPanel(0);
    app.container.appendChild(app.stats.dom);
  },
  start() {
    // app.ex1();
    app.ex2();
  },
  createSubContainer(className: string) {
    const div = document.createElement('div');
    div.classList.add('ex', className);

    let gui = new dat.gui.GUI({ autoPlace: false });
    div.appendChild(gui.domElement);

    app.container.appendChild(div);

    let scene = new three.Scene();
    let camera = new three.PerspectiveCamera(45, 1, 0.1, 1000);
    let renderer = new three.WebGLRenderer({
      alpha: true,
    });
    renderer.setClearColor(new three.Color(0xeeeeee));
    renderer.setSize(400, 400);

    div.appendChild(renderer.domElement);

    let axes = new three.AxesHelper(20);
    scene.add(axes);

    const render = (animationList: Function[]) => {
      app.stats.begin();

      animationList.forEach(fun => fun());
      renderer.render(scene, camera);

      app.stats.end();
      requestAnimationFrame(() => render(animationList));
    }

    const addedCb = (animationList) => {
      app.setCamera(camera, scene);

      render(animationList);
    }

    return {
      scene,
      camera,
      renderer,
      gui,
      subContainer: div,
      cb: addedCb,
    };
  },
  createPlane() {
    let planeGeometry = new three.PlaneGeometry(60, 20);
    let planeMaterial = new three.MeshBasicMaterial({
      color: 0x00ff00,
    })
    var plane = new three.Mesh(planeGeometry, planeMaterial);

    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;

    return plane;
  },
  setObjPosition(obj, { x, y, z }) {
    obj.position.x = x;
    obj.position.y = y;
    obj.position.z = z;
  },
  createCube() {
    let cubeGeometry = new three.BoxGeometry(4, 4, 4);
    let cubeMaterial = new three.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true,
    });
    let cube = new three.Mesh(cubeGeometry, cubeMaterial);

    app.setObjPosition(cube, { x: -4, y: 3, z: 0 });

    return cube;
  },
  setCamera(camera, scene) {
    app.setObjPosition(camera, {
      x: -30,
      y: 40,
      z: 30,
    });
    camera.lookAt(scene.position);
  },
  ex1() {
    const { scene, cb } = app.createSubContainer('ex1')

    scene.add(app.createPlane());
    scene.add(app.createCube());

    cb([]);
  },
  ex2() {
    const { scene, cb, renderer, gui } = app.createSubContainer('ex2');

    const animationList: Function[] = [];
    const speedObj = { cube: 0.02 };
    gui.add(speedObj, 'cube', 0.02, 0.2);

    let planeGeometry = new three.PlaneGeometry(60, 20);
    let planeMaterial = new three.MeshLambertMaterial({
      color: 0x00ff00,
    })
    var plane = new three.Mesh(planeGeometry, planeMaterial);

    plane.rotation.x = -0.5 * Math.PI;
    app.setObjPosition(plane, { x: 15, y: 0, z: 0 });
    plane.receiveShadow = true;
    scene.add(plane);

    const geo = new three.BoxGeometry(4, 4, 4);
    const mat = new three.MeshLambertMaterial({
      color: 0x00ff00,
    });
    const cube = new three.Mesh(geo, mat);
    app.setObjPosition(cube, { x: 4, y: 4, z: 4 });
    cube.castShadow = true;
    scene.add(cube);

    animationList.push(() => cube.rotation.x += speedObj.cube);

    let light = new three.SpotLight(0xffffff);
    light.position.set(-40, 40, 40);
    light.castShadow = true;
    scene.add(light);

    renderer.shadowMapEnabled = true;

    cb(animationList);
  },
};

app.init();
app.start();

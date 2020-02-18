class Juego {
  constructor() {
    if(! Detector.webgl){Detector.addGetWebGLMessage();}

    this.contenedor;
    this.jugador={};
    this.datos;
    this.controles;
    this.escena;
    this.renderer;

    this.contenedor = document.createElement('div');
    this.contenedor.style.height='100%';
    document.body.appendChild(this.contenedor);

    const juego = this;

    this.dirObjetos = 'assets/';

    this.reloj = new THREE.Clock();

    this.iniciar();

    window.onError =(error)=>{
      console.error(JSON.stringify(error));
    }
  }
  iniciar(){
    this.camara = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 2000);
    this.camara.position.set(112,100,400);

    this.escena = new THREE.Scene();
    this.escena.background = new THREE.Color(0xa0a0a0);
    this.escena.fog = new THREE.Fog(0xa0a0a0, 200, 1000);

    let luz =new THREE.HemisphereLight(0xffffff, 0x444444);
    luz.position.set(0,200,0);
    this.escena.add(luz);

    luz = new THREE.DirectionalLight(0xffffff);
    luz.position.set(0,200,100);
    luz.castShadow= true;//activar sombras
    luz.shadow.camera.top =180;
    luz.shadow.camera.bottom =-100;
    luz.shadow.camera.left=-120;
    luz.shadow.camera.right=120;
    this.escena.add(luz);

    //suelo
    var malla = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2000, 2000),
    new THREE.MeshPhongMaterial({color: 0x999999, depthWrite:false }));
    malla.rotation.x=- Math.PI / 2;
    //malla.position.y =-100;
    malla.receiveShadow = true;
    this.escena.add(malla);

    var cuadricula = new THREE.GridHelper(2000,40,0x000000,0x000000);
    //cuadricula.position.y=-100;
    cuadricula.material.opacity=0.2;
    cuadricula.material.transparent = true;
    this.escena.add(cuadricula);

    //modelo

    const loader= new THREE.FBXLoader();
    const juego = this;

    loader.load(`${this.dirObjetos}fbx/people/FireFighter.fbx`,(objeto)=>{
      objeto.mixer = new THREE.AnimationMixer(objeto);
      juego.jugador.mixer= objeto.mixer;
      juego.jugador.root =objeto.mixer.getRoot();

      objeto.name= "FireFighter";

      objeto.traverse((nino)=>{
        if(nino.isMesh){
          nino.material.map=null;
          nino.castShadow= true;
          nino.receiveShadow = false;
        }
      });

      juego.escena.add(objeto);
      juego.jugador.object = objeto;
      juego.jugador.mixer.clipAction(objeto.animations[0]).play();

      juego.animacion();
    });

    this.renderer = new THREE.WebGLRenderer({antialias:true});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.contenedor.appendChild(this.renderer.domElement);

    //control de camara
  this.controles = new THREE.OrbitControls(this.camara, this.renderer.domElement);
  this.controles.target.set(0,150,0);
  this.controles.update();

  window.addEventListener( 'resize', function(){ juego.rescalarPantalla(); }, false );
  }
  rescalarPantalla(){
    this.camara.aspect = window.innerWidth / window.innerHeight;
    this.camara.updateProjectionMatrix();

    this.renderer.setSize( window.innerWidth, window.innerHeight );
  }
  animacion(){
        const juego = this;
        const delta = this.reloj.getDelta();

        requestAnimationFrame(()=>{juego.animacion(); });
        if(this.jugador.mixer !==undefined){this.jugador.mixer.update(delta);}
        this.renderer.render(this.escena,this.camara);
  }
}

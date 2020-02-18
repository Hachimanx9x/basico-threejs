class Juego {
  constructor() {
    //creamos la escena basia
    this.escena= new THREE.Scene();
    //creamos la camara con un angulo 85 ancho y alto del navegador y frustrum(0.1 hasta 1000)
    this.camara = new THREE.PerspectiveCamera(85,  window.innerWidth/window.innerHeight,0.1,1000 );
//definimos el uso de webgl
    this.renderer = new THREE.WebGLRenderer();
    //esto define la esca de pixeles o su calidad 720p o 1080p
    //generalmente depende de la pantalla
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    //agregamos los el renderizador al html
    document.body.appendChild(this.renderer.domElement);
    //creamos un cubo o solo su geometria
    const geometria = new THREE.BoxGeometry(1,1,1);
    //creamos una luz directional
    const luz = new THREE.DirectionalLight(0xffffff);
    luz.position.set(0,20,0);
    const ambiente = new THREE.AmbientLight(0x707070); //es una luz suave en el ambiente
    //creamos una material para el cubo con su color de materia
    const material = new THREE.MeshPhongMaterial({ color: 0x89cff0 });
    //creamos el cubo uniendo su geometria y el material
    this.cubo = new THREE.Mesh(geometria, material);
    //se agregan todos lo elementos a la escena
    this.escena.add(this.cubo);
    this.escena.add(luz);
    this.escena.add(ambiente);

    this.camara.position.z=3;
    this.animar();
  }

  animar(){
    const juego = this;
    //requestAnimationFrame define el numero de repeticiones por segundo
    requestAnimationFrame(()=>{
      juego.animar();//se llama asi mis creando un ciclo continuo
    });
    this.cubo.rotation.x +=0.01;
    this.cubo.rotation.y += 0.01;
    //le decimos a webgl que renderize este fotograma usando la escena a traves de la camara

    this.renderer.render(this.escena,this.camara);
  }
}

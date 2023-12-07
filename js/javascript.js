//variables globales
var nivel=1;
var player="";
var player2="";
var multijugador=2;
var stars="";
var bombs="";
var scoreText="";
var scoreText2="";
var nombrenivel= 'facil';
var arraynombre=  ['facil', 'normal','dificil'];
var modojugador= 'Multijugador';
var arrayplayer= ['Unjugador', 'Multijugador'];
var musicStart=true
var music="";
var music1="";
var cancion="";


class MainScene extends Phaser.Scene{
    constructor(){
        super('gameScene');
    }
    preload(){//es la carga de los recursos y solo se ejecuta una vez
        this.load.baseURL='./';
        this.load.image('fondo','../img/fondo.png');
        this.load.image('plataforma1','../img/plataforma.png');
        this.load.image('suelo','../img/plataforma1.png');
        this.load.spritesheet('jugador1','../img/personaje.png',{frameWidth:32,frameHeight:48});
        this.load.spritesheet('jugador2','../img/character.png',{frameWidth:32,frameHeight:48});
        this.load.image('star','../img/estrella.png');
        this.load.image('bomb','../img/b.png');
        this.load.audio('musica','../img/song.mp3');
        this.load.audio('sound','../img/estrella.mp3');
        this.load.audio('bomba','../img/bomb.mp3');
        this.load.audio('jump','../img/salto.mp3');
      }   
      create(){//esto solo se ejecuta una vez y es la parte logica y armado 
        music1.stop();
        music = this.sound.add('musica');
        
        music.play({
            volume:1,
            loop:true
        }); 
    
          this.add.image(400,250,'fondo').setScale(1.7);//montamos fondo
          var platforms = this.physics.add.staticGroup();
          platforms.create(180,515,'suelo');
          platforms.create(563,515,'suelo');
          platforms.create(789,515,'plataforma1');
          platforms.create(180,485,'suelo');
          platforms.create(563,485,'suelo');
          platforms.create(789,485,'plataforma1');
                  
          if(nivel==1){
              platforms.create(120,190,'plataforma1');
              platforms.create(215,190,'plataforma1');//Estrucura
              platforms.create(780,201,'suelo');
              platforms.create(700,329,'suelo');
              platforms.create(370,275,'plataforma1');
              platforms.create(258,400,'suelo');    
  
          }  
          if(nivel==2){
              platforms.create(125,135,'plataforma1');
              platforms.create(600,180,'plataforma1');
              platforms.create(255,150,'plataforma1');
              platforms.create(360,180,'plataforma1');
              platforms.create(700,280,'suelo');
              platforms.create(250,390,'suelo');
  
          }   
          if(nivel==3){
              platforms.create(100,300,'plataforma1');
              platforms.create(460,280,'plataforma1');
              platforms.create(359,180,'plataforma1');
              platforms.create(750,355,'suelo');
              platforms.create(689,160,'suelo');
              platforms.create(258,358,'plataforma1');
          } 
        //montamos personaje1
        player = this.physics.add.sprite(280,200,'jugador1');
        
        player.setCollideWorldBounds(true);//Collider con el mundo
        player.setBounce(0.5);
        this.physics.add.collider(player,platforms);//Aqui se agregaran las fisicas (coliciones) entre el jugador y las plataformas
        player.score=0;
        scoreText=this.add.text(20,16,'Score1:0',{fontSize:'40px',fill:'#000000'});
        //Fin del montaje del personaje1

        //montamos personaje2
        if(multijugador == 2){
        player2 = this.physics.add.sprite(380,200,'jugador2');

        player2.setCollideWorldBounds(true);
        player2.setBounce(0.5);
        this.physics.add.collider(player2,platforms);
        player2.score=0;
        scoreText2 = this.add.text(500,16,'Score2:0',{fontSize:'40px',fill:'#000000'});
        this.gameTime=5;
        this.timetext=this.add.text(350,0,this.gameTime,{fontSize:'40px',color:'negro'});
        this.refreshTime();
        }
        //Fin del montaje del personaje2

        //montamos estrellas
        stars=this.physics.add.group({
            key:'star',
            repeat:12,
            setXY:{X:12,y:0,stepX:50}
        });
        //fisicas de estrellas
        this.physics.add.collider(stars,platforms);
        stars.children.iterate(function(child){
            child.setBounce(0.5);
        });
        //metodo para consumir las estrellas 
        this.physics.add.overlap(player,stars,collectStar,null,this);
        //montamos bombas
        bombs = this.physics.add.group();
        this.physics.add.collider(bombs,platforms);
        this.physics.add.collider(player,bombs,hitBomb,null,this);

        //funcion hitBomb
        function hitBomb(elemento,bomb){
            const fire1 = this.sound.add('bomba');
            fire1.play({
                volume:0.5,
                loop:false
            });

            if (multijugador==1){
                this.physics.pause();
                player.setTint(0x00ff80);
                this.time.addEvent({
                    delay:2000,
                    loop: false,
                    callback:()=>{this.scene.start("endScene");
                }
                });
            }else {
                if(player.score-10<=0){
                    player.score=0;
                }   else{
                    player.score-=10;
                }
                scoreText.setText('Score1:'+player.score);
            }

        }
        //funcion collectStar
        function collectStar(player,star){
            player.score+=10;
            scoreText.setText('Score1:'+player.score);
            colliderStars(star,this);
            const fire = this.sound.add('sound');
            fire.play({
                volume:0.5,
                loop:false
            });
        }

        //mecanicas del segundo jugador
        if (multijugador==2){
            this.physics.add.overlap(player2,stars,collectStar2,null,this);
            function collectStar2(player2,star){
                player2.score+=10;
                scoreText2.setText('Score2:'+player2.score);
                colliderStars(star,this);
            const fire = this.sound.add('sound');
            fire.play({
                volume:0.5,
                loop:false
            });
            }
            this.physics.add.collider(player2,bombs,hitbomb2,null,this);
        }
        function hitbomb2(elemento,bomb){
            const fire1 = this.sound.add('bomba');
            fire1.play({
                volume:0.5,
                loop:false
            });
            if(player2.score-10 <=0){
                player2.score=0;
            }else{
                player2.score-=10;
            }
            scoreText2.setText('Score2:'+player2.score);
        }

        //funcion colliderStar
        function colliderStars (star,context){
            star.disableBody(true,true);
            if (stars.countActive(true)===0){
                var bomb = bombs.create(Phaser.Math.Between(0,800),16,'bomb');
                bomb.setCollideWorldBounds(true);
                bomb.setBounce(1);
                bomb.setVelocity(Phaser.Math.Between(-400*nivel,400*nivel),20);
                stars.children.iterate(function(child){
                    child.enableBody(true,child.x,0,true,true);

                });
            }
        }

        //montaje de animaciones personaje 1
        //montamos animacion izquierda
        this.anims.create({
            key:'left',
            frames: this.anims.generateFrameNumbers('jugador1',{start:0,end:3}),
            frameRate:10,
            repeat:-1
        });
        //montamos animacion derecha
        this.anims.create({
            key:'right',
            frames: this.anims.generateFrameNumbers('jugador1',{start:5,end:8}),
            frameRate:10,
            repeat:-1
        });
        //montamos animacion frontal
        this.anims.create({
            key:'front',
            frames: this.anims.generateFrameNumbers('jugador1',{start:4,end:4}),
            frameRate:10,
            repeat:-1
        });
        //finalizamos montaje de animaciones de personaje1

        //montamos animaciones de personaje2
        //montamos animacion izquierda
        this.anims.create({
            key:'left2',
            frames: this.anims.generateFrameNumbers('jugador2',{start:0,end:3}),
            frameRate:10,
            repeat:-1
        });
        //montamos animacion derecha
        this.anims.create({
            key:'right2',
            frames: this.anims.generateFrameNumbers('jugador2',{start:5,end:8}),
            frameRate:10,
            repeat:-1
        });
        //montamos animacion frontal
        this.anims.create({
            key:'front2',
            frames: this.anims.generateFrameNumbers('jugador2',{start:4,end:4}),
            frameRate:10,
            repeat:-1
        });
        //finalizamos montaje de animaciones de personaje2
    }
        refreshTime(){
        this.gameTime--;
        this.timetext.setText(this.gameTime);
        if (this.gameTime===0){
            this.physics.pause();
            player.setTint(0x0080FF);
            player2.setTint(0xFF0080);
            this.time.addEvent({
                delay:2000,
                loop:false,
                callback:()=>{
                    this.scene.start('endScene');
                }
            });
        }else{
            this.time.delayedCall(1000,this.refreshTime,[],this);
        }
    }
    update(){//creamos el moviento al personaje1 con las teclas
        const salto = this.sound.add('jump')

       var cursor = this.input.keyboard.createCursorKeys();//grupo teclas por defecto
       if(cursor.left.isDown){
        player.setVelocityX(-160);
        player.anims.play('left',true);
       } else if(cursor.right.isDown){
        player.setVelocityX(160);
        player.anims.play('right',true);
       }else{
        player.setVelocityX(0);
        player.anims.play('front',true);
       }
       if(cursor.up.isDown && player.body.touching.down){
        player.setVelocityY(-300);
          salto.play({volume:0.3});

       }
       //fin de movimiento del personaje1
        
       //creamos el movimiento al personaje2
       if(multijugador == 2){
       var keyup = this.input.keyboard.addKey('W');//guardara la tecla que registremos
       var player2up = keyup.isDown;

       var keyleft = this.input.keyboard.addKey('A');
       var player2left = keyleft.isDown;

       var keyright = this.input.keyboard.addKey('D');
       var player2right = keyright.isDown;

       if(player2left){
        player2.setVelocityX(-160);
        player2.anims.play('left2',true);

       }else if (player2right){
        player2.setVelocityX(160);
        player2.anims.play('right2',true);

       }else{
        player2.setVelocityX(0);
        player2.anims.play('front2',true);
       }
       if(player2up && player2.body.touching.down){
        player2.setVelocityY(-300);
        salto.play({volume:0.3});
       }
       }
       //fin del movimiento del personaje2    
    }
}
class Level extends Phaser.Scene{
    constructor(){
        super('levelScene');
    }
    preload(){
        this.load.image('fondoo','../img/niveles.jpg');
        

    
        }
create(){
   
    this.add.image(400,250,'fondoo').setScale(2.5);
  

    //Baby
    const backbaby = this.add.zone(290,140,130,80);
    backbaby.setOrigin(0);
    backbaby.setInteractive();

    backbaby.once('pointerdown',()=>this.changelevel(1));
  

    //Cool
    const backcool = this.add.zone(290,250,130,80);
    backcool.setOrigin(0);
    backcool.setInteractive();

    backcool.once('pointerdown',()=>this.changelevel(2));
    

    const backdificil = this.add.zone(290,360,130,80);
    backdificil.setOrigin(0);
    backdificil.setInteractive();

    backdificil.once('pointerdown',()=>this.changelevel(3));
   

 


    //Back
    const backba = this.add.zone(290,460,130,80);
    backba.setOrigin(0);
    backba.setInteractive();

    backba.once('pointerdown',()=>this.redirectScene('menuScene1'));
    

}
changelevel(newlevel){
    nivel = newlevel;
    nombrenivel = arraynombre[nivel-1];
}
    redirectScene(sceneName){
    this.scene.start(sceneName);
     
}  
    update(){

    }
    

}
class Menu1 extends Phaser.Scene{
    constructor(){
        super('menuScene1');
    }
    preload(){
    this.load.image('fondo1','../img/niveles.jpg');
  

  
        
            
    }
    create(){
   

        this.add.image(400,250,'fondo1').setScale(2.5);
      

    //this.add.graphics().lineStyle(2,0xff00ff).strokeRectShape(backstar);

     //Level
     const backlevel = this.add.zone(280,320,150,100);
     backlevel.setOrigin(0);
     backlevel.setInteractive();
 
     backlevel.once('pointerdown',()=>this.redirectScene('levelScene'));
     

    //Mode
    const backmode = this.add.zone(280,200,150,100);
    backmode.setOrigin(0);
    backmode.setInteractive();

    backmode.once('pointerdown',()=>this.redirectScene('modeScene'));
   
    
    const back1 = this.add.zone(280,440,150,100);
        back1.setOrigin(0);
        back1.setInteractive();
        back1.once('pointerdown',()=>this.redirectScene('gameScene'));
         
        

    //Controls


   this.add.text(500,300,'Dificultad: ' + nombrenivel,{fontSize:'20px',fill:'#000000'});
   this.add.text(500,400,'Modo: ' + modojugador,{fontSize:'20px',fill:'#000000'});

}
redirectScene(sceneName){
    this.scene.start(sceneName);
}  
   
    update(){
       
          

    } 
}
class Menu extends Phaser.Scene{
    constructor(){
        super('menuScene');
    }
    preload(){
    this.load.image('fondo1','../img/fondo.jpg');
    this.load.audio('musica1','../img/menu.mp3');

  
        
            
    }
    create(){
        
        music1 = this.sound.add('musica1');
        
        music1.play({
            volume:1,
            loop:true
        });

       this.add.image(400,250,'fondo1').setScale(2.5);
       

    //this.add.graphics().lineStyle(2,0xff00ff).strokeRectShape(backstar);

    //Level
    const backlevel = this.add.zone(280,320,150,100);
    backlevel.setOrigin(0);
    backlevel.setInteractive();

    backlevel.once('pointerdown',()=>this.redirectScene('levelScene'));
    

    //Mode
    const backmode = this.add.zone(280,200,150,100);
    backmode.setOrigin(0);
    backmode.setInteractive();

    backmode.once('pointerdown',()=>this.redirectScene('modeScene'));
    
    
    const back1 = this.add.zone(280,440,150,100);
        back1.setOrigin(0);
        back1.setInteractive();
        back1.once('pointerdown',()=>this.redirectScene('gameScene'));
       

    //Controls


   this.add.text(500,300,'Dificultad: ' + nombrenivel,{fontSize:'20px',fill:'#000000'});
   this.add.text(500,400,'Modo: ' + modojugador,{fontSize:'20px',fill:'#000000'});
  
}
redirectScene(sceneName){
    this.scene.start(sceneName);
}  

   
    update(){
       
          

    } 
}
class Mode extends Phaser.Scene{
    constructor(){
        super('modeScene');
    }
    preload(){
    this.load.image('modo','../img/modo.jpg');
  

    }
    create(){
    this.add.image(400,250,'modo').setScale(2.5);
  

    //unoplayer
    const backuno = this.add.zone(280,190,150,90);
    backuno.setOrigin(0);
    backuno.setInteractive();

    backuno.once('pointerdown',()=>this.changeplayer('1'));
   

    //dosplayer
    const backdos = this.add.zone(280,310,150,90);
    backdos.setOrigin(0);
    backdos.setInteractive();

    backdos.once('pointerdown',()=>this.changeplayer('2'));
  

    //Back
    const backba = this.add.zone(280,430,150,90);
    backba.setOrigin(0);
    backba.setInteractive();

    backba.once('pointerdown',()=>this.redirectScene('menuScene1'));
   
    

    }
    changeplayer(newplayer){
        multijugador = newplayer;
        modojugador = arrayplayer[multijugador-1];
    } 
    redirectScene(sceneName){
        this.scene.start(sceneName);  
    }
    update(){
       
       
    } 
}

class Credits extends Phaser.Scene{
    constructor(){
        super('credits');
    }
    preload(){
        this.load.image('credits1','../img/creditos.jpg');

    }
    create(){
        cancion.stop();
        this.add.image(400,250,'credits1').setScale(2);

        const back = this.add.zone(0,0,800,5300);
        back.setOrigin(0);
        back.setInteractive();
        back.once('pointerdown',()=>this.redirectScene('menuScene'));
        
    }
    

    
    update(){

    } 
    
    redirectScene(sceneName){
        this.scene.start(sceneName);
    }  
}
class EndGame extends Phaser.Scene{
    constructor(){
        super('endScene');
    }
    preload(){
        this.load.image('gameover','../img/gameover.jpg'); 
        this.load.audio('cancion1','../img/gameover1.mp3');
    }
    create(){ 
        music.stop();
        cancion = this.sound.add('cancion1');
        
        cancion.play({
            volume:1,
            loop:true
        });
        this.add.image(400,250,'gameover').setScale(2);
        if(multijugador == 2){
        scoreText2=this.add.text(280,400,'Score2:0',{fontSize:'40px',fill:'#FFF1F1F1'});  
        }else(multijugador == 1)
        scoreText=this.add.text(280,350,'Score1:0',{fontSize:'40px',fill:'#FFF1F1F1'}); 
       
       
        const backCredits = this.add.zone(0,0,800,5300);
        backCredits.setOrigin(0);
        backCredits.setInteractive();
        backCredits.once('pointerdown',()=>this.redirectScene('credits'));
      
        
    }
    redirectScene(sceneName){
        this.scene.start(sceneName);
    }
       
    update(){

            if(multijugador == 2){
                scoreText2.setText('Score2:'+player2.score); 

            }else(multijugador == 1)
                scoreText.setText('Score1:'+player.score);       
    } 

    redirectScene(sceneName){
        this.scene.start(sceneName);
    }  
}
//configuracion generica de un juego 
const config ={
    type:Phaser.Auto,
    width:800,
    height:530,
    scene:[Menu,Menu1,MainScene,Level,Mode,Credits,EndGame],
    scale:{
        mode:Phaser.Scale.FIT
    },physics:{
        default:'arcade',
        arcade:{
            debug:false,
            gravity:{
                y:300
            },
        },
     },
};
new Phaser.Game(config);

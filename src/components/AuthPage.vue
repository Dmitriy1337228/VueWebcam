<template>
    <h1>Auth</h1>
    <div class="row">
      <input type="text" id="login-input" class="login-input" placeholder="Enter your login" @keypress="showCamerabutton" />
    </div>
    <div class="auth-button" id="auth-but" style="margin-top:10px;" @click="toggleAuthBut">
        <button type="button">
            <span>Log in</span>
        </button>
    </div>
    <div class="camera-button">
        <button type="button" style="margin-top:10px;" id="cameraButton" class="button is-rounded disabled" :class="{ 'is-primary' : !isCameraOpen, 'is-danger' : isCameraOpen}" @click="toggleCamera">
          <span v-if="!isCameraOpen">Open Camera</span>
          <span v-else>Close Camera</span>
      </button>
    </div>

    <div v-show="isCameraOpen && isLoading" class="camera-loading">
      <ul class="loader-circle">
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>
  
    <div v-if="isCameraOpen" v-show="!isLoading" class="camera-box" :class="{ 'flash' : isShotPhoto }">
      
      <div class="camera-shutter" v-if="showCameraPicture" :class="{'flash' : isShotPhoto}"></div>
        
      <video v-show="!allPhotosTaken" ref="camera" :width="450" :height="337.5" autoplay></video>
      
      <canvas class="disabled" id="photoTaken" ref="canvas" :width="450" :height="337.5"></canvas>
    </div>
    
    <div v-if="isCameraOpen && !isLoading &&showCameraPicture" class="camera-shoot">
      <button type="button" class="button" @click="takePhoto">
        <img src="https://img.icons8.com/material-outlined/50/000000/camera--v2.png">
      </button>
    </div>

    <div v-if="allPhotosTaken && isCameraOpen" class="camera-download">
      <button  class="button" @click="auth" >Send Images on Server</button>
    </div>
</template>

<script>
const authInfo = Object.create(null); // global auth variable
authInfo['mode'] = 'auth';

export default ({
    data() {
      return {
        gate: 'https://457a-194-186-53-115.ngrok-free.app',
        showCameraPicture: true,
        isCameraOpen: false,
        allPhotosTaken: false,
        isShotPhoto: false,
        isLoading: false
      }
    },
    methods: {

        showNotion() {
            alert('login field is empty');
        },

      toggleAuthBut() {
        if (document.getElementById('login-input').value=='') {
            this.showNotion();
            return;
        } else {    
            document.getElementById('auth-but').classList.toggle('disabled');
            document.getElementById('cameraButton').classList.toggle('disabled');
            authInfo['login']=document.getElementById('login-input').value;
            document.getElementById('login-input').classList.toggle('disabled');
        }
        
      }, 

      showCamerabutton(event) {
        if (event.key === "Enter") {
                if (document.getElementById('login-input').value=='') {
                this.showNotion();
            return;
            } else {    
                document.getElementById('auth-but').classList.toggle('disabled');
                document.getElementById('cameraButton').classList.toggle('disabled');
                authInfo['login']=document.getElementById('login-input').value;
                document.getElementById('login-input').classList.toggle('disabled');
        }
        }
      },

        toggleCamera() {
            if(this.isCameraOpen) {
            this.isCameraOpen = false;
            this.allPhotosTaken = false;
            this.isShotPhoto = false;
            this.stopCameraStream();
            } else {
            this.isCameraOpen = true;
            this.createCameraElement();
            }
        },

        createCameraElement() {
        this.isLoading = true;
        
        const constraints = (window.constraints = {
                  audio: false,
                  video: true
              });
  
  
              navigator.mediaDevices
                  .getUserMedia(constraints)
                  .then(stream => {
            this.isLoading = false;
                      this.$refs.camera.srcObject = stream;
                  })
                  .catch(error => {
            this.isLoading = false;
                      alert("May the browser didn't support or there is some errors.");
                  });
        },

        stopCameraStream() {
        let tracks = this.$refs.camera.srcObject.getTracks();
  
              tracks.forEach(track => {
                  track.stop();
              });
        },

        takePhoto() {  
            this.isShotPhoto = true;
  
            const FLASH_TIMEOUT = 50;
  
            setTimeout(() => {
              this.isShotPhoto = false;
            }, FLASH_TIMEOUT);
          
            const context = this.$refs.canvas.getContext('2d');
        context.drawImage(this.$refs.camera, 0, 0, 450, 337.5);
  
        let img = document.getElementById("photoTaken").toDataURL('image/png');
        authInfo['image'] = img; // set img in gloabl auth obj
        
        console.log(authInfo);
        
        this.allPhotosTaken = !this.allPhotosTaken;
        this.showCameraPicture = false;
        
        },

        async auth() {
            let response = await fetch(this.gate, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
            body: JSON.stringify(authInfo)
            }).then((response)=>{
                if (!response.ok) {
                    alert('Wrong person');
                    this.$router.push({ path: '/' })
                } else {
                    alert('success auth');
                    this.$router.push({ path: '/' })
                }
            }); 
        }
    }
})
</script>

<style lang="scss">
  body {
    display: flex;
    justify-content: center;
  }
  
  .disabled {
    display:none;
  }
  
  .row {
     display: flex;
    }
  
  .login-input {
    grid-row: 1;
    grid-column: 1;
    height: 20px;
    float: right;
    /* display: inline-block; */
    align-self: center;
    }
  
  .auth-form {
    padding: 15px;
    width: 300px;
    height: 300px;
    border: 1px solid gray;
    display: grid;
    /* grid-template-columns: auto 150px; */
    grid-template-rows: 30px auto;
    }
  
  .photo-but {
      display: inline-block;
      justify-self: center;
      align-self: end;
  }
  
  .web-camera-container {
    margin-top: 2rem;
    margin-bottom: 2rem;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 20px;
    width: 500px;
  
    
    .camera-button {
      margin-bottom: 2rem;
    }
    
    .camera-box {    
      .camera-shutter {
        opacity: 0;
        width: 450px;
        height: 337.5px;
        background-color: #fff;
        position: absolute;
        
        &.flash {
          opacity: 1;
        }
      }
    }
    
    .camera-shoot {
      margin: 1rem 0;
      
      button {
        height: 60px;
        width: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 100%;
        
        img {
          height: 35px;
          object-fit: cover;
        }
      }
    }
    
    .camera-loading {
      overflow: hidden;
      height: 100%;
      position: absolute;
      width: 100%;
      min-height: 150px;
      margin: 3rem 0 0 -1.2rem;
      
      ul {
        height: 100%;
        position: absolute;
        width: 100%;
        z-index: 999999;
        margin: 0;
      }
      
      .loader-circle {
        display: block;
        height: 14px;
        margin: 0 auto;
        top: 50%;
        left: 100%;
        transform: translateY(-50%);
        transform: translateX(-50%);
        position: absolute;
        width: 100%;
        padding: 0;
        
        li {
          display: block;
          float: left;
          width: 10px;
          height: 10px;
          line-height: 10px;
          padding: 0;
          position: relative;
          margin: 0 0 0 4px;
          background: #999;
          animation: preload 1s infinite;
          top: -50%;
          border-radius: 100%;
          
          &:nth-child(2) {
            animation-delay: .2s;
          }
          
          &:nth-child(3) {
            animation-delay: .4s;
          }
        }
      }
    }
  
    @keyframes preload {
      0% {
        opacity: 1
      }
      50% {
        opacity: .4
      }
      100% {
        opacity: 1
      }
    }
  }
  </style>
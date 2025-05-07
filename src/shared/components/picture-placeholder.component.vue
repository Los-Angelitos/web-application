<!--
import PicturePlaceholderComponent from "../../shared/components/picture-placeholder.component.vue";

export default {
    name: "MainPage",
    components: {
        PicturePlaceholderComponent
    },
    data() {
        return {
            profileImage: null
        };
    },
    methods: {
        onProfileImageSelected(imageUrl) {
            this.profileImage = imageUrl;
            console.log("Selected profile image:", imageUrl);
        }
    },
    
}

Use:

<PicturePlaceholderComponent 
    ref="profilePlaceholder"
    @image-selected="onProfileImageSelected" 
    :initialImage="'https://avatars.githubusercontent.com/u/121122843?s=400&u=7cd3cf93864fc8b3b0ab0fa4e4fc4ddb29cdd78c&v=4'"
    :width="400" 
    :height="450"
    />

width and height are optional, if not provided, default values of 300px and 200px will be used respectively.
400 and 450 are px values, but you can also use other units like '100%', '20em', etc.
-->

<script>
  export default {
    name: 'PicturePlaceholderComponent',
    props: {
      initialImage: {
        type: String,
        default: null
      },
      maxFileSize: {
        type: Number,
        default: () => 5
      },
      allowedTypes: {
        type: Array,
        default: () => ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      },
      width: {
        type: [Number, String],
        default: 300
      },
      height: {
        type: [Number, String],
        default: 200
      }
    },
    data() {
      return {
        imageUrl: null,
        isDragging: false,
        error: null
      };
    },
    created() {
      if (this.initialImage) {
        this.imageUrl = this.initialImage;
      }
    },
    methods: {
      getSize(size) {
        if (typeof size === 'number') {
          return `${size}px`;
        }
        return size;
      },
      triggerFileInput() {
        this.$refs.fileInput.click();
      },
      onDrop(event) {
        this.isDragging = false;
        
        const files = event.dataTransfer.files;
        if (files.length) {
          this.processFile(files[0]);
        }
      },
      onFileSelected(event) {
        const files = event.target.files;
        if (files.length) {
          this.processFile(files[0]);
        }
      },
      processFile(file) {
        this.error = null;
        
        if (!this.allowedTypes.includes(file.type)) {
          this.error = `Tipo de archivo no permitido. Por favor sube ${this.allowedTypes.join(', ')}`;
          return;
        }
        
        if (file.size > this.maxFileSize * 1024 * 1024) {
          this.error = `La imagen excede el tamaño máximo de ${this.maxFileSize}MB`;
          return;
        }
        
        // Leer archivo y convertir a data URL
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageUrl = e.target.result;
          // Emitir evento con el archivo y la URL para que el componente padre pueda manejarlos
          this.$emit('image-selected', {
            file: file,
            dataUrl: e.target.result
          });
        };
        reader.readAsDataURL(file);
      },
      clearImage() {
        this.imageUrl = null;
        this.$emit('image-cleared');
      },
      setImage(imageUrl) {
        this.imageUrl = imageUrl;
      }
    }
  };
  </script>

<template>
    <div class="image-placeholder-container">
      <div 
        class="image-placeholder" 
        :class="{ 'has-image': imageUrl, 'is-dragging': isDragging }"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="onDrop"
        @click="triggerFileInput"
        :style="[
          imageUrl ? { backgroundImage: `url(${imageUrl})` } : {},
          { width: getSize(width), height: getSize(height) }
        ]"
      >
        <div v-if="!imageUrl" class="placeholder-content">
          <div class="icon-container">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="image-icon">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5-7l-3 3.72L9 13l-3 4h12l-4-5z"/>
            </svg>
          </div>
          <span>Arrastra una imagen o haz clic para seleccionar</span>
        </div>
        <div v-else class="image-overlay">
          <div class="icon-container">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="sync-icon">
              <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
            </svg>
          </div>
          <span>Cambiar imagen</span>
        </div>
        <input 
          type="file" 
          ref="fileInput" 
          class="file-input" 
          accept="image/*"
          @change="onFileSelected" 
        />
      </div>
      <p v-if="error" class="error-message">{{ error }}</p>
    </div>
  </template>
  
  <style scoped>
  .image-placeholder-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .image-placeholder {
    border: 2px dashed #ccc;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
  
  .image-placeholder:hover {
    border-color: #2196F3;
  }
  
  .is-dragging {
    border-color: #2196F3;
    background-color: rgba(33, 150, 243, 0.1);
  }
  
  .placeholder-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #666;
    text-align: center;
    padding: 20px;
  }
  
  .icon-container {
    margin-bottom: 10px;
  }
  
  .image-icon, .sync-icon {
    width: 48px;
    height: 48px;
    fill: #999;
  }
  
  .sync-icon {
    fill: white;
  }
  
  .file-input {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
  }
  
  .has-image .placeholder-content {
    display: none;
  }
  
  .image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .has-image:hover .image-overlay {
    opacity: 1;
  }
  
  .error-message {
    color: #d32f2f;
    margin-top: 8px;
    font-size: 0.875rem;
  }
  </style>
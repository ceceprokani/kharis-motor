<template>
  <div class="camera-container">
    <!-- Tampilkan Video Jika Belum Capture -->
    <template v-if="!imageDataUrl">
      <div class="video-wrapper">
        <video ref="videoElement" autoplay playsinline muted></video>

        <!-- Tombol Ambil Gambar -->
        <button @click="captureImage" class="btn btn-primary custom-rounded-medium fw-bold floating-capture-button">
          <div class="d-flex align-items-center"><i class="mdi mdi-camera fs-5 me-1"></i> Ambil Gambar</div>
        </button>

        <!-- Tombol Ganti Kamera -->
        <button @click="toggleCamera" class="btn bg-white btn-square toggle-camera-button">
          <i class="mdi mdi-camera-flip fs-4"></i>
        </button>
      </div>
    </template>

    <!-- Setelah Gambar Diambil -->
    <div v-else class="preview">
      <Cropper
        ref="cropper"
        :src="imageDataUrl"
        :auto-zoom="true"
        :resize-image="true"
        :image-restriction="'stencil'"
        class="cropper"
      />

      <div class="d-flex" style="position: fixed; bottom: 20px">
        <button @click="saveCroppedImage" class="btn btn-primary fw-bold custom-rounded-medium me-2">
          <div class="d-flex align-items-center">
            <i class="mdi mdi-content-save fs-5 me-1"></i>
            Simpan Gambar
          </div>
        </button>
        <button @click="retakePhoto" class="btn btn-white fw-bold custom-rounded-medium">
          <div class="d-flex align-items-center">
            <i class="mdi mdi-camera-party-mode fs-5 me-1"></i>
            Ambil Ulang
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import { jsPDF } from 'jspdf';

export default {
  components: { Cropper },
  data() {
    return {
      imageDataUrl: null,
      cameraStream: null,
      isFrontCamera: true,
    };
  },
  mounted() {
    // this.startCamera();
  },
  methods: {
    // Start the camera with the selected facing mode (front or back)
    async startCamera() {
      try {
        const constraints = {
          video: {
            facingMode: this.isFrontCamera ? 'user' : 'environment',
          },
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        this.cameraStream = stream;

        const video = this.$refs.videoElement;
        if (video) {
          video.srcObject = stream;
          await video.play();
        }
      } catch (err) {
        console.error('Gagal mengakses kamera:', err);
      }
    },

    stopCamera() {
      if (this.cameraStream) {
        this.cameraStream.getTracks().forEach((track) => track.stop());
        this.cameraStream = null;
      }

      const video = this.$refs.videoElement;
      if (video) {
        video.srcObject = null;
      }
    },

    // Capture image from video stream
    captureImage() {
      const video = this.$refs.videoElement;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      this.imageDataUrl = canvas.toDataURL('image/png');

      // Stop camera stream after capturing image
      if (this.cameraStream) {
        this.cameraStream.getTracks().forEach((track) => track.stop());
      }
    },

    // Switch between front and back camera
    async toggleCamera() {
      if (this.cameraStream) {
        this.cameraStream.getTracks().forEach((track) => track.stop());
      }
      this.isFrontCamera = !this.isFrontCamera;
      this.$nextTick(() => {
        this.startCamera();
      });
    },

    // Reset image and restart camera
    retakePhoto() {
      this.imageDataUrl = null;
      this.startCamera();
    },

    // Save cropped image as PDF
    saveCroppedImage() {
      const cropper = this.$refs.cropper;
      if (!cropper) {
        console.error('Cropper tidak ditemukan');
        return;
      }

      const result = cropper.getResult();
      if (!result || !result.canvas) {
        console.error('Gagal mendapatkan hasil crop (canvas null)');
        return;
      }

      const canvas = result.canvas;
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'pt', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
      const width = canvas.width * ratio;
      const height = canvas.height * ratio;

      const x = (pageWidth - width) / 2;
      const y = (pageHeight - height) / 2;

      pdf.addImage(imgData, 'PNG', x, y, width, height);

      const pdfBlob = pdf.output('blob');

      // Konversi canvas ke Blob PNG
      canvas.toBlob((imageBlob) => {
        if (imageBlob) {
          // Emit dua blob: PDF dan Image
          this.$emit('pdf-generated', { pdfBlob, imageBlob });
        } else {
          console.error('Gagal mengonversi canvas ke Blob');
        }
      }, 'image/png');
    }
  },
};
</script>

<style scoped>
.camera-container {
  width: 100vw;
  height: 100vh;
  background: black;
  display: flex;
  justify-content: center;
  align-items: center;
}

.video-wrapper {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

video {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  top: 0;
  left: 0;
}

.floating-capture-button,
.toggle-camera-button {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  padding: 10px 20px;
  cursor: pointer;
}

.floating-capture-button {
  bottom: 20px;
}

.toggle-camera-button {
  bottom: 20px;
  left: 40px;
}

.preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.cropper {
  width: 100%;
  max-height: 80vh;
}
</style>
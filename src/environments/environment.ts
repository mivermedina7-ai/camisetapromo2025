export const environment = {
  production: false,
  founderEmails: [
    'mivermedina7@gmail.com',
    'williamir1234@gmail.com'
  ],
  firebase: {
    apiKey: "AIzaSyBqwNq4_5B_8SCejMki2eeJE-nOdr2HYlA",
    authDomain: "camiseta-d74e5.firebaseapp.com",
    projectId: "camiseta-d74e5",
    storageBucket: "camiseta-d74e5.firebasestorage.app",
    messagingSenderId: "469618675488",
    appId: "1:469618675488:web:4c66608563fa5147059145",
    measurementId: "G-V3K83JPQ2Y"
  },
  cloudinary: {
    // Dashboard -> Account Details -> Cloud name
    cloudName: 'cu23233k',
    // Settings -> Upload -> Upload presets -> camiseta_recuerdos
    uploadPreset: 'camiseta_recuerdos',
    // Carpeta donde Cloudinary guarda los archivos subidos
    folder: 'recuerdos'
  }
};

// Dosya yükleme ve commit mesajı kaydetme
import { storage, db, auth } from './firebase-config.js';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function uploadFile(file, commitMessage) {
  const user = auth.currentUser;
  if (!user) throw new Error("Giriş yapılmamış");

  const storageRef = ref(storage, `${user.uid}/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on('state_changed', null, console.error, async () => {
    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
    await addDoc(collection(db, "files"), {
      uid: user.uid,
      fileName: file.name,
      url: downloadURL,
      commitMessage,
      timestamp: serverTimestamp()
    });
    console.log("Dosya yüklendi:", file.name);
  });
}

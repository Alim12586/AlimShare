// Dosya listeleme ve paylaşım linki üretme
import { db, auth } from './firebase-config.js';
import { collection, query, where, getDocs } from "firebase/firestore";

export async function listUserFiles() {
  const user = auth.currentUser;
  if (!user) throw new Error("Giriş yapılmamış");

  const q = query(collection(db, "files"), where("uid", "==", user.uid));
  const snapshot = await getDocs(q);

  const files = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    files.push({
      name: data.fileName,
      url: data.url,
      commit: data.commitMessage,
      time: data.timestamp?.toDate().toLocaleString()
    });
  });

  return files;
}

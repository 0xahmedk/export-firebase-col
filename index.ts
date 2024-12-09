import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import * as fs from "fs";

// Firebase configuration object
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGE_SENDER_ID,
  appId: process.env.APP_ID,
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Firestore reference
const db = firebase.firestore();

/**
 * Export a Firestore collection to a JSON file.
 * @param collectionName The name of the Firestore collection to export.
 * @param outputFilePath The path to the output JSON file.
 */
async function exportFirestoreCollection(
  collectionName: string,
  outputFilePath: string
): Promise<void> {
  try {
    console.log(`Starting export of collection: ${collectionName}`);

    const collectionRef = db.collection(collectionName);
    const snapshot = await collectionRef.get();

    if (snapshot.empty) {
      console.log(`No documents found in collection: ${collectionName}`);
      return;
    }

    const data: { [key: string]: any } = {};

    snapshot.forEach((doc) => {
      data[doc.id] = doc.data();
    });

    fs.writeFileSync(outputFilePath, JSON.stringify(data, null, 2));
    console.log(`Export completed. Data saved to ${outputFilePath}`);
  } catch (error) {
    console.error("Error exporting collection:", error);
  }
}

// Example usage
const collectionName = "orders"; // Replace with your Firestore collection name
const outputFilePath = "./output.json"; // Replace with your desired output file path

exportFirestoreCollection(collectionName, outputFilePath);

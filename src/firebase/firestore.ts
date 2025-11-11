
'use server';

import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '@/firebase/config';
import type { Property } from '@/lib/types';

const PROPERTIES_COLLECTION = 'properties';

// Function to get all properties for a given owner
export async function getProperties(ownerId: string): Promise<Property[]> {
  const propertiesCollection = collection(db, PROPERTIES_COLLECTION);
  const q = query(propertiesCollection, where("ownerId", "==", ownerId));
  const querySnapshot = await getDocs(q);
  const properties: Property[] = [];
  querySnapshot.forEach((doc) => {
    properties.push({ id: doc.id, ...doc.data() } as Property);
  });
  return properties;
}

// Function to add a new property
export async function addProperty(property: Omit<Property, 'id'>): Promise<Property> {
  const propertiesCollection = collection(db, PROPERTIES_COLLECTION);
  const docRef = await addDoc(propertiesCollection, property);
  return { id: docRef.id, ...property };
}

// Function to update an existing property
export async function updateProperty(id: string, property: Partial<Property>): Promise<void> {
  const propertyDoc = doc(db, PROPERTIES_COLLECTION, id);
  await updateDoc(propertyDoc, property);
}

// Function to delete a property
export async function deleteProperty(id: string): Promise<void> {
  const propertyDoc = doc(db, PROPERTIES_COLLECTION, id);
  await deleteDoc(propertyDoc);
}

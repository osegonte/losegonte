import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'

// Contact Form Submission
export interface ContactFormData {
  name: string
  phone?: string
  email: string
  message: string
}

export const submitContactForm = async (data: ContactFormData) => {
  try {
    const docRef = await addDoc(collection(db, 'contact_submissions'), {
      ...data,
      status: 'new',
      createdAt: serverTimestamp(),
    })
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('Error submitting contact form:', error)
    throw error
  }
}

// Partner Inquiry Submission
export interface PartnerInquiryData {
  facilityName: string
  contactPerson: string
  email: string
  phone: string
  facilityType: string
  locationState: string
  message: string
}

export const submitPartnerInquiry = async (data: PartnerInquiryData) => {
  try {
    const docRef = await addDoc(collection(db, 'partner_inquiries'), {
      ...data,
      status: 'pending',
      createdAt: serverTimestamp(),
    })
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('Error submitting partner inquiry:', error)
    throw error
  }
}

// Driver Application Submission
export interface DriverApplicationData {
  fullName: string
  email: string
  phone: string
  driversLicense: string
  state: string
  experienceYears: number
  hasVehicle: boolean
  vehicleYear?: string
  vehicleMake?: string
  vehicleModel?: string
  cleanRecordAcknowledged: boolean
  drugFreeAcknowledged: boolean
  backgroundCheckConsent: boolean
  whyDriveWithUs: string
}

export const submitDriverApplication = async (data: DriverApplicationData) => {
  try {
    const docRef = await addDoc(collection(db, 'driver_applications'), {
      ...data,
      status: 'pending',
      createdAt: serverTimestamp(),
    })
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('Error submitting driver application:', error)
    throw error
  }
}
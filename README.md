# Event Booking Platform

## Project Overview

A frontend-based Event Booking Platform developed using React and Firebase.
Users can sign up, log in, view events, select a date and time slot, and
successfully book events with proper validations.

## Tech Stack

* React (Hooks)
* Tailwind CSS / shadcn-ui
* Framer Motion
* Firebase Authentication
* Firebase Firestore
* Vercel (Deployment)

## Features Implemented

* User Signup and Login
* Session persistence using Firebase Auth
* Event listing page
* Date and time slot selection
* Booked slots are disabled
* Prevents duplicate slot booking by the same user
* Booking confirmation screen
* Logout functionality
* Responsive UI with smooth animations

## Booking Rules

* Users cannot book an already booked slot
* Same user cannot book the same slot twice
* Slot availability is checked before confirming booking

## Firebase Collections

* users
* events
* bookings

## Setup Instructions

1. Clone the repository
2. Run `npm install`
3. Create a `.env` file and add Firebase credentials
4. Run `npm run dev`

## Live Demo

👉 https://event-management-27eb.vercel.app/

## GitHub Repository

👉 https://github.com/Kanimozhi-RAVI/event-management

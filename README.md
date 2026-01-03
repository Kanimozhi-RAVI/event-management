# Event Booking Platform

## Project Overview
A frontend-focused Event Booking Platform built using React, Tailwind CSS,
Framer Motion, and Firebase.

## Tech Stack
- React (Hooks)
- Tailwind CSS / shadcn-ui
- Framer Motion
- Firebase (Auth + Firestore)
- Deployed on Vercel

## Features Implemented
- User Signup & Login
- Session persistence
- Event listing
- Date & time slot booking
- Prevents double booking
- Booking success screen
- Logout

## Booking Rules
- Already booked slots are disabled
- One user cannot book the same slot twice

## Firebase Schema
- users
- events
- bookings

## Setup Instructions
1. Clone the repo
2. Run `npm install`
3. Create `.env` file with Firebase keys
4. Run `npm run dev`

## Live Demo
👉 https://event-management-eal2.vercel.app/

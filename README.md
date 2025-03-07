# MeroHealth

MeroHealth has many modules which make the application functional and work more efficiently. The different modules of this project are:
- Authentication Module
- User Module
- Medication Module
- Reminder Module
- Adherence Module
- Caregiver Module

## Authentication Module
The authentication module handles user login, registration, and token management. It ensures that users are authenticated before accessing protected resources.

- Manages user login and registration.
- Handles token storage and refresh.
- Ensures secure access to the application.

## User Module
The user module manages user profiles and roles. It allows users to view and update their profile information.

- Fetches and displays user profile information.
- Manages user roles (e.g., patient, caregiver).
- Allows users to update their profile details.

## Medication Module
The medication module handles the creation, updating, and deletion of medications. It also manages medication schedules and notifications.

- Allows users to add and manage medications.
- Handles medication schedules and reminders.
- Sends notifications for medication times.

## Reminder Module
The reminder module manages reminders for medications. It ensures that users are notified at the correct times to take their medications.

- Schedules and displays reminders for medications.
- Sends notifications to users.
- Allows users to view and manage their reminders.

## Adherence Module
The adherence module tracks medication adherence. It allows users to view their adherence records and ensures they are following their medication schedules.

- Tracks and displays medication adherence records.
- Allows users to view their adherence history.
- Ensures users are following their medication schedules.

## Caregiver Module
The caregiver module manages caregiver-patient relationships. It allows caregivers to view and manage their linked patients' medications and adherence records.

- Manages caregiver-patient relationships.
- Allows caregivers to view and manage patients' medications.
- Provides access to patients' adherence records.

## Process Modeling Activity Diagram

```mermaid
graph TD
    start((Start)) --> A[Open App]
    A --> B[Login/Register]
    B -->|Patient| C[Home Screen]
    B -->|Caregiver| D[Caregiver Screen]
    C --> E[Add Medication]
    C --> F[View Reminders]
    C --> G[View Adherence Record]
    C --> H[View Account/Profile]
    D --> I[View Linked Patients]
    D --> J[View Medications]
    D --> G
    D --> E
    E --> K[Add Medication with Schedule]
    F --> L[Show Reminders List]
    G --> M[Show Adherence Record]
    H --> N[Show Linked Caregiver]
    H --> O[Add New Caregiver]
    O --> stop((Stop))
    M --> stop
    L --> stop
    K --> stop
    J --> stop
    I --> stop
    H --> stop
    G --> stop
    F --> stop
    E --> stop
    D --> stop
    C --> stop

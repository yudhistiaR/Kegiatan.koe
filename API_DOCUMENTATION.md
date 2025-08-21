# API Documentation

This documentation provides details about the API endpoints for the Kegiatan Koe application.

## Table of Contents

- [Clerk](#clerk)
- [Laporan](#laporan)
- [Me](#me)
- [Organisasi](#organisasi)
- [Proker](#proker)

## Clerk

### `/api/v1/clerk/organisasi`

- **Method:** `GET`
- **Description:** Retrieves the list of organizations for the currently authenticated user.
- **Response:**
  - `200 OK`: A JSON array of organization memberships.
  - `401 Unauthorized`: If the user is not authenticated.
  - `500 Internal Server Error`: If there is an error fetching the organizations.

### `/api/v1/clerk/organisasi/member`

- **Method:** `GET`
- **Description:** Retrieves the list of members for the current organization.
- **Response:**
  - `200 OK`: A JSON array of organization members.

### `/api/v1/clerk/user`

- **Method:** `GET`
- **Description:** Retrieves the metadata for the currently authenticated user.
- **Response:**
  - `200 OK`: A JSON object containing the user's metadata.
  - `400 Bad Request`: If the user is not found.

- **Method:** `PUT`
- **Description:** Updates the metadata for the currently authenticated user.
- **Request Body:** A JSON object containing the user data to be updated.
- **Response:**
  - `200 OK`: A JSON object with the message "ok".
  - `400 Bad Request`: If the user is not found.

## Laporan

### `/api/v1/laporan/anggota/{org_id}`

- **Method:** `GET`
- **Description:** Retrieves the member report for a specific organization.
- **Parameters:**
  - `org_id`: The ID of the organization.
- **Response:**
  - `200 OK`: A response containing the member report.

### `/api/v1/laporan/daftar-anggota`

- **Method:** `GET`
- **Description:** Generates a PDF report of the member list.
- **Response:**
  - `200 OK`: A PDF file.

### `/api/v1/laporan/kinerja-divisi/{org_id}`

- **Method:** `GET`
- **Description:** Retrieves the division performance report for a specific organization.
- **Parameters:**
  - `org_id`: The ID of the organization.
- **Response:**
  - `200 OK`: A response containing the division performance report.

### `/api/v1/laporan/notulensi/{org_id}`

- **Method:** `GET`
- **Description:** Retrieves the notulensi report for a specific organization.
- **Parameters:**
  - `org_id`: The ID of the organization.
- **Response:**
  - `200 OK`: A response containing the notulensi report.

### `/api/v1/laporan/proker/{org_id}`

- **Method:** `GET`
- **Description:** Retrieves the proker report for a specific organization.
- **Parameters:**
  - `org_id`: The ID of the organization.
- **Response:**
  - `200 OK`: A response containing the proker report.

### `/api/v1/laporan/rab/{org_id}`

- **Method:** `GET`
- **Description:** Retrieves the RAB report for a specific organization.
- **Parameters:**
  - `org_id`: The ID of the organization.
- **Response:**
  - `200 OK`: A response containing the RAB report.

### `/api/v1/laporan/struktur-kepanitiaan/{org_id}`

- **Method:** `GET`
- **Description:** Retrieves the committee structure report for a specific organization.
- **Parameters:**
  - `org_id`: The ID of the organization.
- **Response:**
  - `200 OK`: A response containing the committee structure report.

### `/api/v1/laporan/tugas/{org_id}`

- **Method:** `GET`
- **Description:** Retrieves the task report for a specific organization.
- **Parameters:**
  - `org_id`: The ID of the organization.
- **Response:**
  - `200 OK`: A response containing the task report.

### `/api/v1/laporan/tugas-per-anggota/{org_id}`

- **Method:** `GET`
- **Description:** Retrieves the task per member report for a specific organization.
- **Parameters:**
  - `org_id`: The ID of the organization.
- **Response:**
  - `200 OK`: A response containing the task per member report.

## Me

### `/api/v1/me`

- **Method:** `GET`
- **Description:** Retrieves the profile of the currently authenticated user.
- **Response:**
  - `200 OK`: A JSON object containing the user's profile.

- **Method:** `PUT`
- **Description:** Updates the profile of the currently authenticated user.
- **Request Body:** A JSON object containing the user data to be updated.
- **Response:**
  - `200 OK`: A JSON object with the message "ok".

### `/api/v1/me/{divisiId}/tugas`

- **Method:** `GET`
- **Description:** Retrieves the tasks for the currently authenticated user in a specific division.
- **Parameters:**
  - `divisiId`: The ID of the division.
- **Response:**
  - `200 OK`: A JSON array of tasks.

### `/api/v1/me/tugas`

- **Method:** `GET`
- **Description:** Retrieves the tasks for the currently authenticated user.
- **Response:**
  - `200 OK`: A JSON array of tasks.

### `/api/v1/me/tugas/{prokerId}`

- **Method:** `GET`
- **Description:** Retrieves the tasks for the currently authenticated user in a specific proker.
- **Parameters:**
  - `prokerId`: The ID of the proker.
- **Response:**
  - `200 OK`: A JSON array of tasks.

## Organisasi

### `/api/v1/organisasi/{org_id}/keuangan`

- **Method:** `GET`
- **Description:** Retrieves the financial data for a specific organization.
- **Parameters:**
  - `org_id`: The ID of the organization.
- **Response:**
  - `200 OK`: A JSON object containing the financial data.

### `/api/v1/organisasi/{org_id}/keuangan/pendanaan`

- **Method:** `GET`
- **Description:** Retrieves the funding data for a specific organization.
- **Parameters:**
  - `org_id`: The ID of the organization.
- **Response:**
  - `200 OK`: A JSON object containing the funding data.

- **Method:** `POST`
- **Description:** Adds a funding source for a proker in a specific organization.
- **Parameters:**
  - `org_id`: The ID of the organization.
- **Response:**
  - `200 OK`: A JSON object with the message "ok".

### `/api/v1/organisasi/{org_id}/member`

- **Method:** `GET`
- **Description:** Retrieves the members of a specific organization.
- **Parameters:**
  - `org_id`: The ID of the organization.
- **Response:**
  - `200 OK`: A JSON array of organization members.

### `/api/v1/organisasi/{org_id}/statistics`

- **Method:** `GET`
- **Description:** Retrieves the dashboard statistics for a specific organization.
- **Parameters:**
  - `org_id`: The ID of the organization.
- **Response:**
  - `200 OK`: A JSON object containing the dashboard statistics.

## Proker

### `/api/v1/proker`

- **Method:** `GET`
- **Description:** Retrieves all prokers.
- **Response:**
  - `200 OK`: A JSON array of prokers.

- **Method:** `POST`
- **Description:** Creates a new proker.
- **Request Body:** A JSON object containing the proker data.
- **Response:**
  - `200 OK`: A JSON object of the created proker.

### `/api/v1/proker/{org_id}/{proker_id}`

- **Method:** `GET`
- **Description:** Retrieves a specific proker by its ID.
- **Parameters:**
  - `org_id`: The ID of the organization.
  - `proker_id`: The ID of the proker.
- **Response:**
  - `200 OK`: A JSON object of the proker.

### `/api/v1/proker/{org_id}/{proker_id}/divisi`

- **Method:** `GET`
- **Description:** Retrieves the divisions of a specific proker.
- **Parameters:**
  - `org_id`: The ID of the organization.
  - `proker_id`: The ID of the proker.
- **Response:**
  - `200 OK`: A JSON array of divisions.

- **Method:** `POST`
- **Description:** Creates a new division for a specific proker.
- **Request Body:** A JSON object containing the division data.
- **Response:**
  - `200 OK`: A JSON object of the created division.

- **Method:** `DELETE`
- **Description:** Deletes a division from a specific proker.
- **Query Parameters:**
  - `id`: The ID of the division to be deleted.
- **Parameters:**
  - `org_id`: The ID of the organization.
  - `proker_id`: The ID of the proker.
- **Response:**
  - `200 OK`: A JSON object with the message "ok".

### `/api/v1/proker/{org_id}/{proker_id}/notulensi`

- **Method:** `GET`
- **Description:** Retrieves the notulensi for a specific proker.
- **Parameters:**
  - `org_id`: The ID of the organization.
  - `proker_id`: The ID of the proker.
- **Response:**
  - `200 OK`: A JSON array of notulensi.

- **Method:** `POST`
- **Description:** Creates a new notulensi for a specific proker.
- **Request Body:** A JSON object containing the notulensi data.
- **Response:**
  - `200 OK`: A JSON object of the created notulensi.

### `/api/v1/proker/{org_id}/{proker_id}/rab`

- **Method:** `GET`
- **Description:** Retrieves the RAB for a specific proker.
- **Parameters:**
  - `proker_id`: The ID of the proker.
- **Response:**
  - `200 OK`: A JSON array of RAB items.

- **Method:** `POST`
- **Description:** Creates a new RAB item for a specific proker.
- **Request Body:** A JSON object containing the RAB data.
- **Response:**
  - `200 OK`: A JSON object of the created RAB item.

### `/api/v1/proker/{org_id}/{proker_id}/tugas`

- **Method:** `GET`
- **Description:** Retrieves the tasks for a specific proker.
- **Parameters:**
  - `proker_id`: The ID of the proker.
- **Response:**
  - `200 OK`: A JSON array of tasks.

- **Method:** `POST`
- **Description:** Creates a new task for a specific proker.
- **Request Body:** A JSON object containing the task data.
- **Response:**
  - `200 OK`: A JSON object of the created task.

- **Method:** `PUT`
- **Description:** Updates a task.
- **Request Body:** A JSON object containing the task data to be updated.
- **Response:**
  - `200 OK`: A JSON object of the updated task.

### `/api/v1/proker/{org_id}/{proker_id}/tugas/{tugas_id}`

- **Method:** `PUT`
- **Description:** Updates a specific task.
- **Request Body:** A JSON object containing the task data to be updated.
- **Response:**
  - `200 OK`: A JSON object of the updated task.

### `/api/v1/proker/{org_id}/{proker_id}/tugas/batch`

- **Method:** `PUT`
- **Description:** Updates multiple tasks in a batch.
- **Request Body:** A JSON array of task data to be updated.
- **Response:**
  - `200 OK`: A JSON object with the message "ok".

### `/api/v1/proker/divisi/{divisi_id}`

- **Method:** `GET`
- **Description:** Retrieves a specific division by its ID.
- **Parameters:**
  - `divisi_id`: The ID of the division.
- **Response:**
  - `200 OK`: A JSON object of the division.

- **Method:** `POST`
- **Description:** Adds a member to a division.
- **Request Body:** A JSON object containing the member data.
- **Response:**
  - `200 OK`: A JSON object of the added member.

### `/api/v1/proker/divisi/{divisi_id}/notulen`

- **Method:** `GET`
- **Description:** Retrieves the notulensi for a specific division.
- **Response:**
  - `200 OK`: A JSON array of notulensi.

- **Method:** `POST`
- **Description:** Creates a new notulensi for a specific division.
- **Request Body:** A JSON object containing the notulensi data.
- **Response:**
  - `200 OK`: A JSON object of the created notulensi.

### `/api/v1/proker/divisi/{divisi_id}/rab`

- **Method:** `GET`
- **Description:** Retrieves the RAB for a specific division.
- **Parameters:**
  - `divisi_id`: The ID of the division.
- **Response:**
  - `200 OK`: A JSON array of RAB items.

- **Method:** `POST`
- **Description:** Creates a new RAB item for a specific division.
- **Request Body:** A JSON object containing the RAB data.
- **Parameters:**
  - `divisi_id`: The ID of the division.
- **Response:**
  - `200 OK`: A JSON object of the created RAB item.

- **Method:** `PATCH`
- **Description:** Updates the status of a RAB.
- **Request Body:** A JSON object containing the RAB status.
- **Response:**
  - `200 OK`: A JSON object of the updated RAB.

### `/api/v1/proker/divisi/{divisi_id}/rab/{rab_id}`

- **Method:** `DELETE`
- **Description:** Deletes a specific RAB item.
- **Parameters:**
  - `rab_id`: The ID of the RAB item.
- **Response:**
  - `200 OK`: A JSON object with the message "ok".

- **Method:** `PATCH`
- **Description:** Updates the status of a RAB.
- **Request Body:** A JSON object containing the RAB status.
- **Response:**
  - `200 OK`: A JSON object of the updated RAB.

### `/api/v1/proker/divisi/{divisi_id}/rab/revisi`

- **Method:** `PATCH`
- **Description:** Updates the revision status of a RAB.
- **Request Body:** A JSON object containing the RAB revision status.
- **Response:**
  - `200 OK`: A JSON object of the updated RAB.

### `/api/v1/proker/divisi/{divisi_id}/tugas`

- **Method:** `GET`
- **Description:** Retrieves the tasks for a specific division.
- **Parameters:**
  - `divisi_id`: The ID of the division.
- **Response:**
  - `200 OK`: A JSON array of tasks.

- **Method:** `POST`
- **Description:** Creates a new task for a specific division.
- **Request Body:** A JSON object containing the task data.
- **Response:**
  - `200 OK`: A JSON object of the created task.

- **Method:** `PUT`
- **Description:** Updates a task.
- **Request Body:** A JSON object containing the task data to be updated.
- **Response:**
  - `200 OK`: A JSON object of the updated task.

- **Method:** `DELETE`
- **Description:** Deletes a task.
- **Request Body:** A JSON object containing the task id.
- **Response:**
  - `200 OK`: A JSON object with the message "ok".

### `/api/v1/proker/divisi/{divisi_id}/tugas/batch`

- **Method:** `PUT`
- **Description:** Updates multiple tasks in a batch.
- **Request Body:** A JSON array of task data to be updated.
- **Response:**
  - `200 OK`: A JSON object with the message "ok".

### `/api/v1/proker/rab`

- **Method:** `GET`
- **Description:** Retrieves all RABs.
- **Response:**
  - `200 OK`: A JSON array of RABs.

- **Method:** `PATCH`
- **Description:** Updates the status of a RAB.
- **Request Body:** A JSON object containing the RAB status.
- **Response:**
  - `200 OK`: A JSON object of the updated RAB.

### `/api/v1/proker/tugas`

- **Method:** `GET`
- **Description:** Retrieves all tasks.
- **Response:**
  - `200 OK`: A JSON array of tasks.

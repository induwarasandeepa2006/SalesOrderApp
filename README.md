\# Sales Order Application



A full-stack Sales Order management app built with .NET Core (Clean Architecture) and React.



\## Tech Stack



\*\*Backend:\*\*

\- .NET Core 10 Web API

\- Entity Framework Core

\- SQL Server (LocalDB)

\- Clean Architecture (Domain, Application, Infrastructure, API layers)



\*\*Frontend:\*\*

\- React (Vite)

\- Redux Toolkit

\- React Router

\- Tailwind CSS

\- Axios



\## Project Structure



\## Features



\- \*\*Screen 1 — Sales Order Form\*\*: Create/edit sales orders with customer selection (auto-fills address), multi-line item entry with live Excl/Tax/Incl calculation.

\- \*\*Screen 2 — Home\*\*: Grid listing all sales orders. Double-click a row to edit.



\## Calculation Logic



\## How to Run



\### Backend



1\. Navigate to the project root:



2\. Update the connection string in `appsettings.json` if needed (defaults to LocalDB).

3\. Apply migrations (creates the database):

4\. Run the API:

5\. API will be available at `http://localhost:5294`, Swagger UI at `http://localhost:5294/swagger`.



\### Frontend



1\. Navigate to the client folder:

2\. Install dependencies:

3\. Run the dev server:

4\. App will be available at `http://localhost:5173`.



\*\*Note:\*\* Both backend and frontend must be running simultaneously for the app to work.



\## Sample Data



The database starts empty. Use Swagger (`/swagger`) to POST a few test Clients and Items before creating Sales Orders, or add them through future admin screens.


# Vehicle Data Service Challenge

Revelo Vehicle Data Service Challenge

## Project Overview

The Vehicle Data Service Challenge consists of the following main components:

1. Data Fetching and Parsing (XML Parser Service)
2. Data Transformation and Storage (Data Transformation Service) (later implemented in a separate service but kept for consistency)
3. Data Storage (Database Service)
4. GraphQL API (Vehicle Resolver)

5. Import data (A script added to import the data to the db. Specific to this challenge.)

### Key Features

- Fetches all vehicle makes and their corresponding vehicle types
- Parses XML data into a usable format
- Transforms and stores the data in a database
- Implements error handling and retries for API requests
- Provides a GraphQL API to query vehicle data
- Uses batch processing and concurrency to optimize data import

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm
- A running instance of MongoDB

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```

### Running the Application

1. Start the application:
   ```
   npm run start
   ```

2. To import data, run:
   ```
   npm run import-data
   ```

3. Once the data is imported, you can query it using the GraphQL API at `http://localhost:3000/graphql`

## API Usage

The GraphQL API provides two main queries:

1. `vehicles`: Fetches all vehicles
2. `vehicle(makeId: Int!)`: Fetches a specific vehicle by its make ID

Example query:

query {
  vehicles {
    Make_ID
    Make_Name
    VehicleTypes {
      VehicleTypeId
      VehicleTypeName
    }
  }
}

query {
  vehicle(makeId: 123) {
    Make_ID
    Make_Name
    VehicleTypes {
      VehicleTypeId
      VehicleTypeName
    }
  }
}

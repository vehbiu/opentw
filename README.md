# OpenTW

OpenTW is a modern, user-friendly frontend application for viewing and tracking wrestling tournament data from TrackWrestling. It provides real-time updates, clean bracket visualizations, and match notifications.

## Overview

OpenTW connects to the [OpenTW API](https://github.com/vehbiu/opentw-api) to provide a superior user experience for wrestling tournament participants, coaches, and spectators. The application offers features like tournament search, live match tracking, and bracket visualization.

## Features

- User-friendly interface for viewing tournament information
- Real-time match status updates
- Clean, interactive bracket visualizations
- Mobile-responsive design
- Tournament search functionality
- Notifications for match changes

## Installation

### Prerequisites
- Node.js (v14+)
- npm or yarn
- Access to OpenTW API

### Setup
1. Clone the repository:
   ```
   git clone https://github.com/vehbiu/opentw.git
   cd opentw
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Configure API endpoint:
   Create a `.env` file in the root directory and add:
   ```
   REACT_APP_API_URL=https://opentw-api.vehbi.me
   # or use your local API instance
   # REACT_APP_API_URL=http://localhost:8000
   ```

4. Start the development server:
   ```
   npm start
   # or
   yarn start
   ```

The application will be available at `http://localhost:3000`.

## Usage

### Finding a Tournament
1. Use the search bar to find tournaments by name, location, or date
2. Select a tournament from the search results

### Viewing Tournament Information
- See general tournament details
- View all weight classes
- Check match schedules and mat assignments

### Tracking Matches
- See live match statuses
- Receive notifications for status changes
- Track specific wrestlers or weight classes

### Viewing Brackets
- Interactive bracket visualization
- Results and advancement tracking
- Printable bracket views

## Deployment

To build for production:
```
npm run build
# or
yarn build
```

The build artifacts will be stored in the `build/` directory.

## Live Demo

A live version of the application is available at: https://opentw.vehbi.me

## Related Projects

- [OpenTW API](https://github.com/vehbiu/opentw-api) - Backend API for this frontend

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE)

## Contact

For issues and contributions, please visit the [GitHub repository](https://github.com/vehbiu/opentw).
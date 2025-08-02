export const mockIssues = [
  {
    id: '1',
    title: 'Large pothole on Main Street',
    description: 'Deep pothole causing damage to vehicles near the intersection of Main St and Oak Ave. Multiple cars have been affected.',
    category: 'roads',
    status: 'in-progress',
    priority: 'high',
    location: 'Main St & Oak Ave',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    reportedBy: 'Sarah Johnson',
    reportedAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    estimatedResolution: new Date('2024-01-25'),
    votes: 23,
    isHidden: false
  },
  {
    id: '2',
    title: 'Overflowing garbage bins at Central Park',
    description: 'Multiple garbage bins are overflowing, attracting pests and creating unsanitary conditions.',
    category: 'waste',
    status: 'reported',
    priority: 'medium',
    location: 'Central Park, Section C',
    reportedBy: 'Alex Rivera',
    reportedAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22'),
    votes: 15,
    isHidden: false
  },
  {
    id: '3',
    title: 'Water leak under sidewalk',
    description: 'Continuous water leak creating a sinkhole. Water is running into the street.',
    category: 'water',
    status: 'resolved',
    priority: 'urgent',
    location: 'Pine Street near Elementary School',
    reportedBy: 'Emily Davis',
    reportedAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
    actualResolution: new Date('2024-01-18'),
    votes: 31,
    isHidden: false
  },
  {
    id: '4',
    title: 'Broken streetlight on Elm Avenue',
    description: 'Streetlight has been out for over a week, creating safety concerns for pedestrians.',
    category: 'lighting',
    status: 'reported',
    priority: 'medium',
    location: 'Elm Avenue, Block 300',
    reportedBy: 'Robert Kim',
    reportedAt: new Date('2024-01-21'),
    updatedAt: new Date('2024-01-21'),
    votes: 8,
    isHidden: false
  },
  {
    id: '5',
    title: 'Playground equipment needs repair',
    description: 'Swing set chains are rusted and potentially unsafe for children.',
    category: 'parks',
    status: 'in-progress',
    priority: 'high',
    location: 'Riverside Park Playground',
    reportedBy: 'Lisa Thompson',
    reportedAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-21'),
    estimatedResolution: new Date('2024-01-28'),
    votes: 19,
    isHidden: false
  }
];

export const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@email.com',
    reportCount: 3,
    joinedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    reportCount: 1,
    joinedAt: new Date('2024-01-10')
  }
];
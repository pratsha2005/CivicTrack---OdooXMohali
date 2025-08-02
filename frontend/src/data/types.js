// types.js

/**
 * @typedef {Object} Comment
 * @property {string} id
 * @property {string} author
 * @property {string} content
 * @property {Date} createdAt
 * @property {boolean} [isOfficial]
 */

/**
 * @typedef {Object} Issue
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {'roads'|'waste'|'water'|'lighting'|'parks'|'other'} category
 * @property {'reported'|'in-progress'|'resolved'|'closed'} status
 * @property {'low'|'medium'|'high'|'urgent'} priority
 * @property {string} location
 * @property {{ lat: number, lng: number }} [coordinates]
 * @property {string} reportedBy
 * @property {Date} reportedAt
 * @property {Date} updatedAt
 * @property {Date} [estimatedResolution]
 * @property {Date} [actualResolution]
 * @property {number} votes
 * @property {Comment[]} comments
 * @property {string[]} [images]
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {boolean} [isOfficial]
 */
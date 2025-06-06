/**
 * @typedef {Object} TypeElement
 * @property {number} id
 * @property {string} nomType
 */

/**
 * @typedef {Object} Element
 * @property {number} idElt
 * @property {string} desElt
 * @property {string} cheminElt
 * @property {TypeElement} typeElement
 */

/**
 * @typedef {Object} ElementCours
 * @property {Element} element
 */

/**
 * @typedef {Object} EspaceCours
 * @property {number} idespac
 * @property {string} titre
 * @property {string} description
 * @property {ElementCours[]} elementsCours
 */

/**
 * @typedef {Object} ElementsModalProps
 * @property {boolean} isOpen
 * @property {function} onClose
 * @property {EspaceCours} espaceCours
 */

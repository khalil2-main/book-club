const { Router}= require('express')

const router=Router();



// Liste statique de livres
const staticBooks = [
  {
    _id: '1',
    title: 'Le Petit Prince',
    author: 'Antoine de Saint-Exupéry',
    description: 'Un conte poétique et philosophique.',
    createdAt: new Date('2025-11-01')
  },
  {
    _id: '2',
    title: 'L’Étranger',
    author: 'Albert Camus',
    description: 'Un roman sur l’absurdité de la vie.',
    createdAt: new Date('2025-11-10')
  },
  {
    _id: '3',
    title: '1984',
    author: 'George Orwell',
    description: 'Un classique de la dystopie politique.',
    createdAt: new Date('2025-11-20')
  }
];

router.get('/', (req, res) => {
  // Option de tri par date de création (du plus récent au plus ancien)
  const sorted = [...staticBooks].sort((a, b) => b.createdAt - a.createdAt);
  res.json(sorted);
});



module.exports=router
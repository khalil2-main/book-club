import React, {useState} from 'react';

const ListItem = ({item}) => (
  <div className="flex items-center justify-between p-3 border-b">
    <div>
      <div className="font-medium">{item.title}</div>
      <div className="text-xs text-gray-500">{item.books.length} books</div>
    </div>
    <button className="px-3 py-1 bg-indigo-600 text-white rounded">Open</button>
  </div>
);

const ReadingLists = ({lists, onAdd}) => {
  const [name, setName] = useState('');

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-indigo-600">Mes listes</h4>
        <div className="flex gap-2">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nouvelle liste" className="px-2 py-1 border rounded" />
          <button onClick={()=>{ if(name.trim()){ onAdd(name.trim()); setName(''); } }} className="px-3 py-1 bg-indigo-600 text-white rounded">Ajouter</button>
        </div>
      </div>

      <div className="divide-y">
        {lists.length===0 && <div className="text-gray-500 p-3">Aucune liste. Ajoutez-en une.</div>}
        {lists.map(l => <ListItem key={l.id} item={l} />)}
      </div>
    </div>
  );
}

export default ReadingLists;
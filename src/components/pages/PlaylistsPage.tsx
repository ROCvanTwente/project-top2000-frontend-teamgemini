// import React, { useState } from 'react';
// import { Plus, Trash2, Music, List, Clock } from 'lucide-react';
// import { usePlaylist } from '../../contexts/PlaylistContext';
// import { songs, artists } from '../../data/mockData';

// interface PlaylistsPageProps {
//   onNavigate: (page: string, params?: any) => void;
// }

// export function PlaylistsPage({ onNavigate }: PlaylistsPageProps) {
//   const { playlists, createPlaylist, deletePlaylist, removeSongFromPlaylist } = usePlaylist();
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [newPlaylistName, setNewPlaylistName] = useState('');
//   const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(
//     playlists.length > 0 ? playlists[0].id : null
//   );

//   const handleCreatePlaylist = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (newPlaylistName.trim()) {
//       createPlaylist(newPlaylistName);
//       setNewPlaylistName('');
//       setShowCreateForm(false);
//     }
//   };

//   const handleDeletePlaylist = (id: string) => {
//     if (confirm('Weet je zeker dat je deze afspeellijst wilt verwijderen?')) {
//       deletePlaylist(id);
//       if (selectedPlaylist === id) {
//         setSelectedPlaylist(playlists.length > 1 ? playlists[0].id : null);
//       }
//     }
//   };

//   const currentPlaylist = playlists.find(p => p.id === selectedPlaylist);

//   const playlistSongs = currentPlaylist
//     ? currentPlaylist.songIds.map(songId => {
//         const song = songs.find(s => s.id === songId);
//         const artist = song ? artists.find(a => a.id === song.artistId) : null;
//         return { song, artist };
//       }).filter(item => item.song && item.artist)
//     : [];

//   return (
//     <div className="min-h-screen bg-[var(--color-gray-lighter)] py-12">
//       <div className="max-w-7xl mx-auto px-4">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div className="flex items-center gap-4">
//             <div className="w-1 h-16 bg-gradient-to-b from-[var(--color-gray-dark)] to-[var(--color-gray-medium)] rounded-full"></div>
//             <div>
//               <h1 className="text-[var(--color-gray-dark)]">Mijn Afspeellijsten</h1>
//               <p className="text-[var(--color-gray-medium)] mt-1">
//                 Beheer je persoonlijke collectie van Top 2000 nummers
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={() => setShowCreateForm(true)}
//             className="flex items-center gap-2 bg-[var(--color-gray-dark)] hover:bg-[var(--color-black)] text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
//           >
//             <Plus size={20} />
//             Nieuwe Lijst
//           </button>
//         </div>

//         {/* Create Form */}
//         {showCreateForm && (
//           <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-[var(--color-gray-light)]">
//             <h2 className="text-[var(--color-gray-dark)] mb-4">Nieuwe afspeellijst maken</h2>
//             <form onSubmit={handleCreatePlaylist} className="flex gap-4">
//               <input
//                 type="text"
//                 value={newPlaylistName}
//                 onChange={(e) => setNewPlaylistName(e.target.value)}
//                 placeholder="Naam van de afspeellijst"
//                 className="flex-grow border-2 border-[var(--color-gray-light)] rounded-lg p-3 focus:outline-none focus:border-[var(--color-gray-dark)] transition-colors"
//                 autoFocus
//               />
//               <button
//                 type="submit"
//                 className="bg-[var(--color-gray-dark)] hover:bg-[var(--color-black)] text-white px-8 py-3 rounded-lg transition-all duration-200"
//               >
//                 Aanmaken
//               </button>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setShowCreateForm(false);
//                   setNewPlaylistName('');
//                 }}
//                 className="border-2 border-[var(--color-gray-light)] hover:border-[var(--color-gray-medium)] text-[var(--color-gray-dark)] px-8 py-3 rounded-lg transition-all duration-200"
//               >
//                 Annuleren
//               </button>
//             </form>
//           </div>
//         )}

//         {/* Main Content */}
//         {playlists.length === 0 ? (
//           <div className="bg-white rounded-xl shadow-lg p-16 text-center border border-[var(--color-gray-light)]">
//             <div className="max-w-md mx-auto">
//               <div className="bg-[var(--color-gray-lighter)] rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
//                 <List className="text-[var(--color-gray-medium)]" size={48} />
//               </div>
//               <h2 className="text-[var(--color-gray-dark)] mb-3">Nog geen afspeellijsten</h2>
//               <p className="text-[var(--color-gray-medium)] mb-8 text-lg">
//                 Maak je eerste afspeellijst aan om je favoriete TOP 2000 nummers te verzamelen en te organiseren
//               </p>
//               <button
//                 onClick={() => setShowCreateForm(true)}
//                 className="bg-[var(--color-gray-dark)] hover:bg-[var(--color-black)] text-white px-8 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
//               >
//                 <Plus size={20} />
//                 Maak je eerste lijst
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div className="grid md:grid-cols-4 gap-6">
//             {/* Playlists Sidebar */}
//             <div className="md:col-span-1">
//               <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[var(--color-gray-light)] sticky top-4">
//                 <div className="bg-gradient-to-r from-[var(--color-gray-dark)] to-[var(--color-gray-medium)] text-white p-5">
//                   <h3 className="text-white flex items-center gap-2">
//                     <List size={20} />
//                     Mijn Lijsten ({playlists.length})
//                   </h3>
//                 </div>
//                 <div className="divide-y divide-[var(--color-gray-light)] max-h-[600px] overflow-y-auto">
//                   {playlists.map(playlist => (
//                     <div
//                       key={playlist.id}
//                       className={`p-4 cursor-pointer hover:bg-[var(--color-gray-lighter)] transition-all duration-200 ${
//                         selectedPlaylist === playlist.id 
//                           ? 'bg-[var(--color-gray-lighter)] border-l-4 border-[var(--color-gray-dark)]' 
//                           : ''
//                       }`}
//                       onClick={() => setSelectedPlaylist(playlist.id)}
//                     >
//                       <div className="flex items-start justify-between gap-2">
//                         <div className="flex-grow min-w-0">
//                           <div className="font-semibold text-[var(--color-gray-dark)] truncate mb-1">
//                             {playlist.name}
//                           </div>
//                           <div className="text-sm text-[var(--color-gray-medium)] flex items-center gap-1">
//                             <Music size={14} />
//                             {playlist.songIds.length} {playlist.songIds.length === 1 ? 'nummer' : 'nummers'}
//                           </div>
//                         </div>
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleDeletePlaylist(playlist.id);
//                           }}
//                           className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0 p-1 hover:bg-red-50 rounded"
//                           title="Verwijder lijst"
//                         >
//                           <Trash2 size={18} />
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Playlist Content */}
//             <div className="md:col-span-3">
//               {currentPlaylist ? (
//                 <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[var(--color-gray-light)]">
//                   {/* Playlist Header */}
//                   <div className="bg-gradient-to-br from-[var(--color-gray-dark)] via-[var(--color-gray-medium)] to-[var(--color-gray-dark)] text-white p-8">
//                     <div className="flex items-start justify-between">
//                       <div>
//                         <div className="text-sm text-white/70 mb-2 uppercase tracking-wider">Afspeellijst</div>
//                         <h1 className="text-white mb-3">{currentPlaylist.name}</h1>
//                         <div className="flex items-center gap-4 text-white/90">
//                           <span className="flex items-center gap-2">
//                             <Music size={18} />
//                             {playlistSongs.length} {playlistSongs.length === 1 ? 'nummer' : 'nummers'}
//                           </span>
//                           <span className="flex items-center gap-2">
//                             <Clock size={18} />
//                             Aangemaakt {new Date(currentPlaylist.createdAt).toLocaleDateString('nl-NL')}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Songs List */}
//                   {playlistSongs.length === 0 ? (
//                     <div className="p-16 text-center text-[var(--color-gray-medium)]">
//                       <div className="bg-[var(--color-gray-lighter)] rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
//                         <Music size={40} className="text-[var(--color-gray-medium)]" />
//                       </div>
//                       <h3 className="text-[var(--color-gray-dark)] mb-2">Deze afspeellijst is nog leeg</h3>
//                       <p className="text-sm">Voeg nummers toe vanaf de nummerpagina's</p>
//                     </div>
//                   ) : (
//                     <div className="divide-y divide-[var(--color-gray-light)]">
//                       {playlistSongs.map(({ song, artist }, index) => (
//                         <div
//                           key={song!.id}
//                           className="p-4 hover:bg-[var(--color-gray-lighter)] transition-all duration-200 group"
//                         >
//                           <div className="flex items-center gap-4">
//                             {/* Track Number */}
//                             <div className="w-10 text-center">
//                               <span className="text-[var(--color-gray-medium)] font-mono">
//                                 {String(index + 1).padStart(2, '0')}
//                               </span>
//                             </div>

//                             {/* Album Art Placeholder */}
//                             <div className="w-14 h-14 bg-gradient-to-br from-[var(--color-gray-light)] to-[var(--color-gray-medium)] rounded-lg flex items-center justify-center flex-shrink-0">
//                               <Music size={24} className="text-white" />
//                             </div>

//                             {/* Song Info */}
//                             <div
//                               className="flex-grow cursor-pointer min-w-0"
//                               onClick={() => onNavigate('song-detail', { songId: song!.id })}
//                             >
//                               <h3 className="text-[var(--color-gray-dark)] hover:text-[var(--color-black)] transition-colors truncate mb-1">
//                                 {song!.title}
//                               </h3>
//                               <p 
//                                 className="text-[var(--color-gray-medium)] text-sm hover:underline cursor-pointer truncate"
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   onNavigate('artist-detail', { artistId: artist!.id });
//                                 }}
//                               >
//                                 {artist!.name}
//                               </p>
//                             </div>

//                             {/* Actions */}
//                             <div className="opacity-0 group-hover:opacity-100 transition-opacity">
//                               <button
//                                 onClick={() => removeSongFromPlaylist(currentPlaylist.id, song!.id)}
//                                 className="text-red-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
//                                 title="Verwijder uit lijst"
//                               >
//                                 <Trash2 size={20} />
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <div className="bg-white rounded-xl shadow-lg p-16 text-center border border-[var(--color-gray-light)]">
//                   <div className="bg-[var(--color-gray-lighter)] rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
//                     <List size={40} className="text-[var(--color-gray-medium)]" />
//                   </div>
//                   <p className="text-[var(--color-gray-medium)] text-lg">
//                     Selecteer een afspeellijst om te bekijken
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
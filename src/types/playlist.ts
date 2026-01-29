export interface ApiPlaylist {
  id: number;
  name: string;
  playListSongs: ApiPlaylistSong[];
}

export interface ApiPlaylistSong {
  songId: number;
  song: {
    songId: number;
    titel: string;
    artist: {
      artistId: number;
      name: string;
    };
  };
}

export interface Song {
  id: string;
  title: string;
  artistId: string;
  releaseYear: number;
  lyrics?: string;
  albumCover?: string;
  youtubeLink?: string;
  timesInTop2000: number;
}

export interface Artist {
  id: string;
  name: string;
  bio?: string;
  wikipediaLink?: string;
  website?: string;
  photo?: string;
  timesInTop2000: number;
}

export interface Ranking {
  year: number;
  songId: string;
  position: number;
}

export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  password: string;
}

export interface Playlist {
  id: string;
  userId: string;
  name: string;
  songIds: string[];
  createdAt: Date;
}

export const artists: Artist[] = [
  {
    id: '1',
    name: 'Queen',
    bio: 'Queen are a British rock band formed in London in 1970. The band comprised Freddie Mercury (lead vocals, piano), Brian May (guitar, vocals), Roger Taylor (drums, vocals) and John Deacon (bass).',
    wikipediaLink: 'https://en.wikipedia.org/wiki/Queen_(band)',
    website: 'https://www.queenonline.com',
    timesInTop2000: 15
  },
  {
    id: '2',
    name: 'Eagles',
    bio: 'The Eagles are an American rock band formed in Los Angeles in 1971. With five number-one singles and six number-one albums, six Grammy Awards and five American Music Awards, the Eagles were one of the most successful musical acts of the 1970s.',
    wikipediaLink: 'https://en.wikipedia.org/wiki/Eagles_(band)',
    website: 'https://eagles.com',
    timesInTop2000: 12
  },
  {
    id: '3',
    name: 'Billy Joel',
    bio: 'William Martin Joel is an American singer, pianist, and songwriter. Commonly nicknamed the "Piano Man" after his album and signature song of the same name, he has led a commercially successful career as a solo artist since the 1970s.',
    wikipediaLink: 'https://en.wikipedia.org/wiki/Billy_Joel',
    website: 'https://www.billyjoel.com',
    timesInTop2000: 10
  },
  {
    id: '4',
    name: 'The Beatles',
    bio: 'The Beatles were an English rock band formed in Liverpool in 1960. The group, whose best-known line-up comprised John Lennon, Paul McCartney, George Harrison and Ringo Starr, are regarded as the most influential band of all time.',
    wikipediaLink: 'https://en.wikipedia.org/wiki/The_Beatles',
    website: 'https://www.thebeatles.com',
    timesInTop2000: 20
  },
  {
    id: '5',
    name: 'Coldplay',
    bio: 'Coldplay are a British rock band formed in London in 1997. They consist of vocalist and pianist Chris Martin, guitarist Jonny Buckland, bassist Guy Berryman, drummer Will Champion and manager Phil Harvey.',
    wikipediaLink: 'https://en.wikipedia.org/wiki/Coldplay',
    website: 'https://www.coldplay.com',
    timesInTop2000: 8
  },
  {
    id: '6',
    name: 'Bruce Springsteen',
    bio: 'Bruce Frederick Joseph Springsteen is an American singer, songwriter, and musician. He has released 21 studio albums, most of which feature his backing band, the E Street Band.',
    wikipediaLink: 'https://en.wikipedia.org/wiki/Bruce_Springsteen',
    website: 'https://brucespringsteen.net',
    timesInTop2000: 11
  },
  {
    id: '7',
    name: 'Pink Floyd',
    bio: 'Pink Floyd are an English rock band formed in London in 1965. Gaining an early following as one of the first British psychedelic groups, they were distinguished by their philosophical lyrics, sonic experimentation, extended compositions, and elaborate live shows.',
    wikipediaLink: 'https://en.wikipedia.org/wiki/Pink_Floyd',
    website: 'https://www.pinkfloyd.com',
    timesInTop2000: 13
  },
  {
    id: '8',
    name: 'Dire Straits',
    bio: 'Dire Straits were a British rock band formed in London in 1977 by Mark Knopfler, David Knopfler, John Illsley, and Pick Withers. They were active from 1977 to 1988 and again from 1990 to 1995.',
    wikipediaLink: 'https://en.wikipedia.org/wiki/Dire_Straits',
    website: 'https://www.direstraits.com',
    timesInTop2000: 9
  },
  {
    id: '9',
    name: 'Fleetwood Mac',
    bio: 'Fleetwood Mac are a British-American rock band, formed in London in 1967. Fleetwood Mac have sold more than 120 million records worldwide, making them one of the best-selling bands of all time.',
    wikipediaLink: 'https://en.wikipedia.org/wiki/Fleetwood_Mac',
    website: 'https://www.fleetwoodmac.com',
    timesInTop2000: 8
  },
  {
    id: '10',
    name: 'Led Zeppelin',
    bio: 'Led Zeppelin were an English rock band formed in London in 1968. The group comprised vocalist Robert Plant, guitarist Jimmy Page, bassist/keyboardist John Paul Jones, and drummer John Bonham.',
    wikipediaLink: 'https://en.wikipedia.org/wiki/Led_Zeppelin',
    website: 'https://www.ledzeppelin.com',
    timesInTop2000: 11
  }
];

export const songs: Song[] = [
  {
    id: '1',
    title: 'Bohemian Rhapsody',
    artistId: '1',
    releaseYear: 1975,
    lyrics: 'Is this the real life? Is this just fantasy?\nCaught in a landslide, no escape from reality...',
    youtubeLink: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ',
    timesInTop2000: 25
  },
  {
    id: '2',
    title: 'Hotel California',
    artistId: '2',
    releaseYear: 1976,
    lyrics: 'On a dark desert highway, cool wind in my hair\nWarm smell of colitas, rising up through the air...',
    youtubeLink: 'https://www.youtube.com/watch?v=09839DpTctU',
    timesInTop2000: 25
  },
  {
    id: '3',
    title: 'Piano Man',
    artistId: '3',
    releaseYear: 1973,
    lyrics: "It's nine o'clock on a Saturday\nThe regular crowd shuffles in...",
    youtubeLink: 'https://www.youtube.com/watch?v=gxEPV4kolz0',
    timesInTop2000: 25
  },
  {
    id: '4',
    title: 'Hey Jude',
    artistId: '4',
    releaseYear: 1968,
    lyrics: 'Hey Jude, don\'t make it bad\nTake a sad song and make it better...',
    youtubeLink: 'https://www.youtube.com/watch?v=A_MjCqQoLLA',
    timesInTop2000: 25
  },
  {
    id: '5',
    title: 'Fix You',
    artistId: '5',
    releaseYear: 2005,
    lyrics: 'When you try your best, but you don\'t succeed\nWhen you get what you want, but not what you need...',
    youtubeLink: 'https://www.youtube.com/watch?v=k4V3Mo61fJM',
    timesInTop2000: 19
  },
  {
    id: '6',
    title: 'Born to Run',
    artistId: '6',
    releaseYear: 1975,
    lyrics: 'In the day we sweat it out on the streets of a runaway American dream\nAt night we ride through the mansions of glory...',
    youtubeLink: 'https://www.youtube.com/watch?v=IxuThNgl3YA',
    timesInTop2000: 25
  },
  {
    id: '7',
    title: 'Wish You Were Here',
    artistId: '7',
    releaseYear: 1975,
    lyrics: 'So, so you think you can tell\nHeaven from hell, blue skies from pain...',
    youtubeLink: 'https://www.youtube.com/watch?v=IXdNnw99-Ic',
    timesInTop2000: 25
  },
  {
    id: '8',
    title: 'Sultans of Swing',
    artistId: '8',
    releaseYear: 1978,
    lyrics: 'You get a shiver in the dark\nIt\'s a raining in the park but meantime...',
    youtubeLink: 'https://www.youtube.com/watch?v=8Pa9x9fZBtY',
    timesInTop2000: 25
  },
  {
    id: '9',
    title: 'Go Your Own Way',
    artistId: '9',
    releaseYear: 1977,
    lyrics: 'Loving you isn\'t the right thing to do\nHow can I ever change things that I feel...',
    youtubeLink: 'https://www.youtube.com/watch?v=6ul-cZyuYq4',
    timesInTop2000: 25
  },
  {
    id: '10',
    title: 'Stairway to Heaven',
    artistId: '10',
    releaseYear: 1971,
    lyrics: 'There\'s a lady who\'s sure all that glitters is gold\nAnd she\'s buying a stairway to heaven...',
    youtubeLink: 'https://www.youtube.com/watch?v=QkF3oxziUI4',
    timesInTop2000: 25
  },
  {
    id: '11',
    title: 'Love of My Life',
    artistId: '1',
    releaseYear: 1975,
    timesInTop2000: 23
  },
  {
    id: '12',
    title: 'Somebody to Love',
    artistId: '1',
    releaseYear: 1976,
    timesInTop2000: 22
  },
  {
    id: '13',
    title: 'The Show Must Go On',
    artistId: '1',
    releaseYear: 1991,
    timesInTop2000: 20
  },
  {
    id: '14',
    title: 'Viva la Vida',
    artistId: '5',
    releaseYear: 2008,
    timesInTop2000: 16
  },
  {
    id: '15',
    title: 'Clocks',
    artistId: '5',
    releaseYear: 2002,
    timesInTop2000: 22
  }
];

export const rankings: Ranking[] = [
  // 2024
  { year: 2024, songId: '1', position: 1 },
  { year: 2024, songId: '2', position: 2 },
  { year: 2024, songId: '3', position: 3 },
  { year: 2024, songId: '10', position: 4 },
  { year: 2024, songId: '7', position: 5 },
  { year: 2024, songId: '4', position: 6 },
  { year: 2024, songId: '8', position: 7 },
  { year: 2024, songId: '6', position: 8 },
  { year: 2024, songId: '9', position: 9 },
  { year: 2024, songId: '5', position: 10 },
  { year: 2024, songId: '11', position: 15 },
  { year: 2024, songId: '12', position: 23 },
  { year: 2024, songId: '13', position: 31 },
  { year: 2024, songId: '14', position: 42 },
  { year: 2024, songId: '15', position: 55 },
  // 2023
  { year: 2023, songId: '1', position: 2 },
  { year: 2023, songId: '2', position: 1 },
  { year: 2023, songId: '3', position: 4 },
  { year: 2023, songId: '10', position: 3 },
  { year: 2023, songId: '7', position: 6 },
  { year: 2023, songId: '4', position: 5 },
  { year: 2023, songId: '8', position: 8 },
  { year: 2023, songId: '6', position: 7 },
  { year: 2023, songId: '9', position: 11 },
  { year: 2023, songId: '5', position: 12 },
  // 2022
  { year: 2022, songId: '1', position: 1 },
  { year: 2022, songId: '2', position: 3 },
  { year: 2022, songId: '3', position: 5 },
  { year: 2022, songId: '10', position: 2 },
  { year: 2022, songId: '7', position: 4 },
];

export const djs = [
  { name: 'Jeroen van Inkel', wikipediaLink: 'https://nl.wikipedia.org/wiki/Jeroen_van_Inkel' },
  { name: 'Wouter van der Goes', wikipediaLink: 'https://nl.wikipedia.org/wiki/Wouter_van_der_Goes' },
  { name: 'Bart Arens', wikipediaLink: 'https://nl.wikipedia.org/wiki/Bart_Arens' },
  { name: 'Rob Stenders', wikipediaLink: 'https://nl.wikipedia.org/wiki/Rob_Stenders' },
  { name: 'Anneke Janssen', wikipediaLink: 'https://nl.wikipedia.org/wiki/Anneke_Janssen' },
  { name: 'Leo Blokhuis', wikipediaLink: 'https://nl.wikipedia.org/wiki/Leo_Blokhuis' },
];

export const users: User[] = [
  {
    id: '1',
    email: 'admin@top2000.nl',
    password: 'admin123',
    role: 'admin'
  },
  {
    id: '2',
    email: 'user@top2000.nl',
    password: 'user123',
    role: 'user'
  }
];

export const playlists: Playlist[] = [];

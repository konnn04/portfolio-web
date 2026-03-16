export interface DiscordActivity {
  id?: string;
  type: number;
  name: string;
  state?: string;
  details?: string;
  emoji?: { name?: string };
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
  timestamps?: {
    start?: number;
    end?: number;
  };
  sync_id?: string;
}

export interface SpotifyData {
  album: string;
  album_art_url: string;
  artist: string;
  song: string;
  timestamps: {
    start: number;
    end: number;
  };
  track_id: string;
}

export interface DiscordData {
  discord_status: string;
  activities?: DiscordActivity[];
  listening_to_spotify?: boolean;
  spotify?: SpotifyData;
}

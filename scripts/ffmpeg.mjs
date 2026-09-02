/**
 * Findet ffmpeg, ohne sich auf den PATH zu verlassen.
 *
 * Die Skripte lasen frueher nur FFMPEG_PATH und fielen sonst auf "ffmpeg" im
 * PATH zurueck. In dieser Umgebung liegt ffmpeg aber nur als Beigabe des
 * Python-Pakets imageio-ffmpeg vor, und eine frisch gestartete Sitzung hat
 * die Variable nicht gesetzt -- die Kette brach dann mitten drin mit ENOENT
 * ab, nachdem die Vertonung bereits bezahlt war.
 */
import {existsSync, readdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';

const IMAGEIO = '/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries';

const ausImageio = () => {
  if (!existsSync(IMAGEIO)) return null;
  const treffer = readdirSync(IMAGEIO).filter((f) => f.startsWith('ffmpeg-'));
  return treffer.length ? `${IMAGEIO}/${treffer[0]}` : null;
};

/** Reihenfolge: gesetzte Variable, PATH, dann die Python-Beigabe. */
export const ffmpegPfad = () => {
  if (process.env.FFMPEG_PATH) return process.env.FFMPEG_PATH;

  const imPfad = spawnSync('ffmpeg', ['-version'], {encoding: 'utf8'});
  if (!imPfad.error && imPfad.status === 0) return 'ffmpeg';

  const beigabe = ausImageio();
  if (beigabe) return beigabe;

  throw new Error(
    'Kein ffmpeg gefunden. Entweder FFMPEG_PATH setzen oder ' +
      '"pip install imageio-ffmpeg" ausfuehren.'
  );
};

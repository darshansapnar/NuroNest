import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";

import { sleepExperiences, type SleepExperience } from "@/data/sleep-support";

const DEFAULT_SLEEP_TIMER_MINUTES = 30;
const DEFAULT_VOLUME = 70;
/** Seconds over which the audio fades to silence before the Sleep Timer ends. */
const FADE_OUT_SECONDS = 10;

/**
 * Owns the Sleep Support mini player's state for the whole page — which
 * experience is loaded, playback of its real, licensed audio file (see
 * AUDIO_LICENSES.md), and an independent Sleep Timer that ends the session
 * after 15/30/45/60 minutes regardless of the audio track's own length (the
 * track loops to fill the session).
 *
 * `audioRef` is taken as a parameter (not returned) so this hook's return
 * value is plain state — the caller renders the actual `<audio>` element
 * with `src` bound to `experience.audioUrl` so switching experiences is a
 * normal declarative re-render; this hook only drives play/pause/seek and
 * listens for real playback events.
 */
function useSleepPlayer(audioRef: RefObject<HTMLAudioElement | null>) {
  const [experience, setExperience] = useState<SleepExperience>(
    sleepExperiences[0],
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [trackDuration, setTrackDuration] = useState(0);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [durationMinutes, setDurationMinutes] = useState(
    DEFAULT_SLEEP_TIMER_MINUTES,
  );
  const [timerRemainingSeconds, setTimerRemainingSeconds] = useState(
    DEFAULT_SLEEP_TIMER_MINUTES * 60,
  );

  const volumeRef = useRef(DEFAULT_VOLUME);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Setting `src` makes the browser abort the current resource without
  // necessarily firing a `pause` event, so intent-to-autoplay is captured
  // here at switch time rather than read back off `isPlaying` inside the
  // effect that runs after the new source is already committed.
  const autoplayNextRef = useRef(false);
  // Shuffle mode's back-history, so Previous undoes random jumps instead of
  // just landing on another random track.
  const shuffleHistoryRef = useRef<string[]>([]);
  const [lastExperienceId, setLastExperienceId] = useState(experience.id);

  // Reset the displayed playback position whenever a different experience
  // becomes active. Adjusted during render (React's documented pattern for
  // resetting state on a prop/state change) rather than in an effect, so it
  // doesn't trigger an extra external-system sync pass.
  if (lastExperienceId !== experience.id) {
    setLastExperienceId(experience.id);
    setCurrentTime(0);
    setTrackDuration(0);
  }

  useEffect(() => {
    volumeRef.current = volume;
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume, audioRef]);

  // The <audio> element's `src` is bound declaratively to
  // `experience.audioUrl` by the caller, so by the time this layout effect
  // runs the browser has already started loading the new source — calling
  // play() here (synchronously, before paint) keeps it close enough to the
  // original click for autoplay policies to allow it.
  useLayoutEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volumeRef.current / 100;
    if (autoplayNextRef.current) {
      audio.play().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experience.id]);

  // isPlaying, volume and mute all mirror the real <audio> element's state
  // rather than being set optimistically, so the UI can never claim
  // "playing" while the element is actually paused/errored/muted.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setTrackDuration(audio.duration || 0);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    // If a file fails to load/decode, don't leave the UI stuck showing
    // "playing" for audio that isn't actually sounding.
    const handleError = () => setIsPlaying(false);
    // Only mirrors `muted` (toggleMute is the sole other writer of it, via
    // audio.muted directly). Deliberately NOT mirroring `.volume` back into
    // state here — the Sleep Timer's fade-out drives `.volume` directly on
    // every tick, and echoing those transient values back would overwrite
    // `volumeRef` with a faded-toward-zero value right before the timer
    // restores it, permanently zeroing the volume after every session ends.
    const handleVolumeChange = () => {
      setIsMuted(audio.muted);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("error", handleError);
    audio.addEventListener("volumechange", handleVolumeChange);
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("volumechange", handleVolumeChange);
    };
  }, [audioRef]);

  // Sleep Timer: counts the session down independently of the audio file's
  // own duration (the track loops underneath it), fading playback out over
  // its final seconds before stopping.
  useEffect(() => {
    if (!isPlaying) return;

    timerIntervalRef.current = setInterval(() => {
      setTimerRemainingSeconds((prev) => {
        const next = prev - 1;
        const audio = audioRef.current;

        if (audio && next <= FADE_OUT_SECONDS) {
          audio.volume =
            (volumeRef.current / 100) * (Math.max(next, 0) / FADE_OUT_SECONDS);
        }

        if (next <= 0) {
          if (audio) {
            audio.pause();
            audio.currentTime = 0;
            audio.volume = volumeRef.current / 100;
          }
          return durationMinutes * 60;
        }

        return next;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isPlaying, durationMinutes, audioRef]);

  function play() {
    autoplayNextRef.current = true;
    audioRef.current?.play().catch(() => {});
  }

  function pause() {
    autoplayNextRef.current = false;
    audioRef.current?.pause();
  }

  function togglePlay() {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }

  function goToExperience(
    next: SleepExperience,
    options: { continuePlayback: boolean },
  ) {
    autoplayNextRef.current = options.continuePlayback;
    setExperience(next);
  }

  function selectExperience(next: SleepExperience) {
    if (next.id === experience.id) {
      if (isPlaying) {
        pause();
      } else {
        play();
      }
      return;
    }

    shuffleHistoryRef.current.push(experience.id);
    goToExperience(next, { continuePlayback: true });
  }

  function toggleShuffle() {
    setIsShuffleOn((prev) => !prev);
  }

  function next() {
    const currentIndex = sleepExperiences.findIndex(
      (item) => item.id === experience.id,
    );

    let upcoming: SleepExperience;
    if (isShuffleOn && sleepExperiences.length > 1) {
      const candidates = sleepExperiences.filter(
        (item) => item.id !== experience.id,
      );
      upcoming = candidates[Math.floor(Math.random() * candidates.length)];
    } else {
      upcoming = sleepExperiences[(currentIndex + 1) % sleepExperiences.length];
    }

    shuffleHistoryRef.current.push(experience.id);
    goToExperience(upcoming, { continuePlayback: isPlaying });
  }

  function previous() {
    const currentIndex = sleepExperiences.findIndex(
      (item) => item.id === experience.id,
    );

    let upcoming: SleepExperience | undefined;
    if (isShuffleOn) {
      const previousId = shuffleHistoryRef.current.pop();
      upcoming = previousId
        ? sleepExperiences.find((item) => item.id === previousId)
        : undefined;
    }

    if (!upcoming) {
      upcoming =
        sleepExperiences[
          (currentIndex - 1 + sleepExperiences.length) % sleepExperiences.length
        ];
    }

    goToExperience(upcoming, { continuePlayback: isPlaying });
  }

  function seekTo(seconds: number) {
    const audio = audioRef.current;
    const clamped = Math.min(Math.max(seconds, 0), trackDuration || 0);
    if (audio) audio.currentTime = clamped;
    setCurrentTime(clamped);
  }

  function changeVolume(next: number) {
    const clamped = Math.min(Math.max(next, 0), 100);
    setVolume(clamped);
    // Raising the volume from the slider is expected to audibly unmute.
    if (audioRef.current && clamped > 0) audioRef.current.muted = false;
  }

  function toggleMute() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
  }

  function changeDuration(minutes: number) {
    setDurationMinutes(minutes);
    setTimerRemainingSeconds(minutes * 60);
    // Cancel any in-progress end-of-session fade so a freshly (re)started
    // timer plays back at the person's chosen volume.
    if (audioRef.current) audioRef.current.volume = volumeRef.current / 100;
  }

  return {
    experience,
    isPlaying,
    currentTime,
    trackDuration,
    volume,
    isMuted,
    isShuffleOn,
    durationMinutes,
    timerRemainingSeconds,
    selectExperience,
    togglePlay,
    toggleShuffle,
    next,
    previous,
    seekTo,
    changeVolume,
    toggleMute,
    changeDuration,
  };
}

export { useSleepPlayer };

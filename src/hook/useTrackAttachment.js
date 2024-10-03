/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";

export function useTrackAttachment(tracks, ref) {
  useEffect(() => {
    const track = tracks[0];
    if (track && ref.current) {
      track.attach(ref.current);
      return () => {
        track.detach(ref.current);
      };
    }
  }, [tracks, ref]);
}

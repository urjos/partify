import { useVideoPlayer, VideoView } from "expo-video";
import { styled } from "nativewind";
import { Image, ImageSourcePropType } from "react-native";

const StyledVideoView = styled(VideoView);

type EventVideoProps = {
  uri: string;
  className?: string;
};

// Componente aparte porque useVideoPlayer es un hook — solo puede llamarse
// cuando de verdad vamos a renderizar un video, no condicionalmente dentro
// de EventMedia.
const EventVideo = ({ uri, className }: EventVideoProps) => {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  return (
    <StyledVideoView
      player={player}
      className={className}
      contentFit="cover"
      nativeControls={false}
      allowsFullscreen={false}
      allowsPictureInPicture={false}
    />
  );
};

type EventMediaProps = {
  image: ImageSourcePropType;
  video?: string;
  className?: string;
};

const EventMedia = ({ image, video, className }: EventMediaProps) => {
  if (video) {
    return <EventVideo uri={video} className={className} />;
  }

  return <Image source={image} className={className} resizeMode="cover" />;
};

export default EventMedia;

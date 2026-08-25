import { useVideoPlayer, VideoView } from "expo-video";
import { styled } from "nativewind";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  View,
} from "react-native";

const StyledVideoView = styled(VideoView);

type VideoSlideProps = {
  uri: string;
  width: number;
  className?: string;
};

// Componente aparte porque useVideoPlayer es un hook — cada video de la
// lista necesita su propia instancia, solo se crea cuando de verdad hay
// un slide de video que renderizar.
const VideoSlide = ({ uri, width, className }: VideoSlideProps) => {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  useEffect(() => {
    const subscription = player.addListener("playToEnd", () => {
      player.currentTime = 0;
      player.play();
    });
    return () => subscription.remove();
  }, [player]);

  return (
    <StyledVideoView
      player={player}
      style={{ width }}
      className={className}
      contentFit="cover"
      nativeControls={false}
      allowsFullscreen={false}
      allowsPictureInPicture={false}
    />
  );
};

type EventMediaCarouselProps = {
  media: EventMediaItem[];
  className?: string;
  onPress?: () => void;
};

const EventMediaCarousel = ({
  media,
  className,
  onPress,
}: EventMediaCarouselProps) => {
  const [width, setWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const onLayout = (event: LayoutChangeEvent) => {
    const measured = event.nativeEvent.layout.width;
    if (measured > 0 && measured !== width) setWidth(measured);
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!width) return;
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    if (index !== activeIndex) setActiveIndex(index);
  };

  return (
    <View className="event-media-carousel" onLayout={onLayout}>
      {width > 0 && (
        <FlatList
          data={media}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => String(index)}
          onScroll={onScroll}
          scrollEventThrottle={16}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          renderItem={({ item }) => (
            <Pressable onPress={onPress} style={{ width }}>
              {item.type === "video" ? (
                <VideoSlide
                  uri={item.uri}
                  width={width}
                  className={className}
                />
              ) : (
                <Image
                  source={item.source}
                  style={{ width }}
                  className={className}
                  resizeMode="cover"
                />
              )}
            </Pressable>
          )}
        />
      )}

      {media.length > 1 && (
        <View className="event-media-dots" pointerEvents="none">
          {media.map((_, index) => (
            <View
              key={index}
              className={
                index === activeIndex
                  ? "event-media-dot event-media-dot-active"
                  : "event-media-dot"
              }
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default EventMediaCarousel;

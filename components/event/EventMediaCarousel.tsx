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
  contentFit?: "cover" | "contain";
};

// Componente aparte porque useVideoPlayer es un hook — cada video de la
// lista necesita su propia instancia, solo se crea cuando de verdad hay
// un slide de video que renderizar.
const VideoSlide = ({
  uri,
  width,
  className,
  contentFit = "cover",
}: VideoSlideProps) => {
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
      contentFit={contentFit}
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
  onIndexChange?: (index: number) => void;
  hideDots?: boolean;
  resizeMode?: "cover" | "contain";
};

const EventMediaCarousel = ({
  media,
  className,
  onPress,
  onIndexChange,
  hideDots = false,
  resizeMode = "cover",
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
    if (index !== activeIndex) {
      setActiveIndex(index);
      if (onIndexChange) onIndexChange(index);
    }
  };

  if (!media || media.length === 0) return null;

  return (
    <View className="event-media-carousel" onLayout={onLayout}>
      {width > 0 &&
        (media.length === 1 ? (
          <Pressable
            onPress={onPress}
            style={{ width, height: "100%" }}
            className="h-full items-center justify-center overflow-hidden"
          >
            {media[0].type === "video" ? (
              <VideoSlide
                uri={media[0].uri}
                width={width}
                className={className}
                contentFit={resizeMode}
              />
            ) : (
              <Image
                source={media[0].source}
                style={{ width }}
                className={className}
                resizeMode={resizeMode}
              />
            )}
          </Pressable>
        ) : (
          <FlatList
            data={media}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            className="h-full w-full"
            keyExtractor={(_, index) => String(index)}
            onScroll={onScroll}
            scrollEventThrottle={16}
            getItemLayout={(_, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            renderItem={({ item }) => (
              <Pressable
                onPress={onPress}
                style={{ width, height: "100%" }}
                className="h-full items-center justify-center overflow-hidden"
              >
                {item.type === "video" ? (
                  <VideoSlide
                    uri={item.uri}
                    width={width}
                    className={className}
                    contentFit={resizeMode}
                  />
                ) : (
                  <Image
                    source={item.source}
                    style={{ width }}
                    className={className}
                    resizeMode={resizeMode}
                  />
                )}
              </Pressable>
            )}
          />
        ))}

      {!hideDots && media.length > 1 && (
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

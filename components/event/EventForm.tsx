import DateTimeCard from "@/components/event/DateTimeCard";
import DressCodeSection from "@/components/event/DressCodeSection";
import EventFeaturesSection from "@/components/event/EventFeaturesSection";
import EventMediaCarousel from "@/components/event/EventMediaCarousel";
import LocationPrivacyCard from "@/components/event/LocationPrivacyCard";
import MusicTypeSelector from "@/components/event/MusicTypeSelector";
import PricingAforoSection from "@/components/event/PricingAforoSection";
import HorizontalChips from "@/components/shared/HorizontalChips";
import { DRESS_CATEGORIES, EVENT_CATEGORIES } from "@/constants/categories";
import { icons } from "@/constants/icons";
import { colors } from "@/constants/theme";
import { uploadMediaToSupabase } from "@/lib/storage";
import { useLocationPickerStore } from "@/lib/store/locationPickerStore";
import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { styled } from "nativewind";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import ContactMethodCard from "./ContactMethodCard";

const EVENT_CATEGORY_ITEMS = EVENT_CATEGORIES.map((item) => ({
  id: item,
  label: item,
}));

const SafeAreaView = styled(RNSafeAreaView);

const MAX_MEDIA_ITEMS = 3;

type EventFormProps = {
  screenTitle?: string;
  submitLabel?: string;
  submittingLabel?: string;
  initialEvent?: EventItem;
  onSubmit: (draft: Omit<EventItem, "id">) => Promise<void>;
};

export default function EventForm({
  screenTitle = "Crear evento",
  submitLabel = "Publicar",
  submittingLabel = "Publicando...",
  initialEvent,
  onSubmit,
}: EventFormProps) {
  const { user } = useUser();
  const pickedLocation = useLocationPickerStore(
    (state) => state.pickedLocation,
  );
  const clearPickedLocation = useLocationPickerStore(
    (state) => state.clearPickedLocation,
  );

  // Estados de Multimedia
  const [mediaItems, setMediaItems] = useState<EventMediaItem[]>(
    initialEvent?.media ?? [],
  );

  // Estados de Información Básica
  const [title, setTitle] = useState(initialEvent?.title ?? "");
  const [category, setCategory] = useState<string>(
    initialEvent?.category ?? EVENT_CATEGORIES[0],
  );
  const [musicTypes, setMusicTypes] = useState<string[]>(
    initialEvent?.typeMusic
      ? initialEvent.typeMusic.split(",").map((s) => s.trim())
      : ["Reggaeton", "Salsa"],
  );
  const [description, setDescription] = useState(
    initialEvent?.description ?? "",
  );

  const [dressCode, setDressCode] = useState<string>(
    initialEvent?.dressCode ?? DRESS_CATEGORIES[0],
  );
  const [dressCodeDetails, setDressCodeDetails] = useState<string>(
    initialEvent?.dressCodeDetails ?? "",
  );

  const [corkageFree, setCorkageFree] = useState<boolean>(
    initialEvent?.corkageFree ?? false,
  );
  const [openBar, setOpenBar] = useState<boolean>(
    initialEvent?.openBar ?? false,
  );
  const [isAdultsOnly, setIsAdultsOnly] = useState<boolean>(
    initialEvent?.isAdultsOnly ?? false,
  );
  const [requirePhysicalId, setRequirePhysicalId] = useState<boolean>(
    initialEvent?.requirePhysicalId ?? false,
  );

  // Estados de Fecha y Horarios
  const [date, setDate] = useState<Date>(
    initialEvent?.startAt ? new Date(initialEvent.startAt) : new Date(),
  );
  const [startTime, setStartTime] = useState<Date>(() => {
    if (initialEvent?.startAt) return new Date(initialEvent.startAt);
    const d = new Date();
    d.setHours(18, 30, 0, 0);
    return d;
  });
  const [endTime, setEndTime] = useState<Date>(() => {
    if (initialEvent?.closingAt) return new Date(initialEvent.closingAt);
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(3, 30, 0, 0);
    return d;
  });

  // Estados de Ubicación y Privacidad
  const [location, setLocation] = useState<{
    address: string;
    latitude: number;
    longitude: number;
  } | null>(
    initialEvent
      ? {
          address: initialEvent.location,
          latitude: initialEvent.latitude ?? -12.0464,
          longitude: initialEvent.longitude ?? -77.0428,
        }
      : null,
  );
  const [hideExactAddress, setHideExactAddress] = useState(
    initialEvent?.hideExactAddress ?? false,
  );

  // Estados de Aforo y Precios
  const [isFree, setIsFree] = useState(initialEvent?.isFreeEvent ?? false);
  const [isMultiplePrices, setIsMultiplePrices] = useState(
    initialEvent?.isMultiplePrices ?? false,
  );
  const [priceMen, setPriceMen] = useState(
    initialEvent?.price != null ? String(initialEvent.price) : "",
  );
  const [priceWomen, setPriceWomen] = useState(
    initialEvent?.priceWomen != null ? String(initialEvent.priceWomen) : "",
  );
  const [capacity, setCapacity] = useState(initialEvent?.capacity ?? 40);

  // Estados de Medios de Contacto
  const [contactMethod, setContactMethod] = useState<"chat" | "external">(
    initialEvent?.contactMethod ?? "chat",
  );
  const [contactPhone, setContactPhone] = useState(
    initialEvent?.contactPhone ?? "",
  );
  const [externalTicketUrl, setExternalTicketUrl] = useState(
    initialEvent?.externalTicketUrl ?? "",
  );

  const [submitting, setSubmitting] = useState(false);

  // Escucha cambios de ubicación seleccionada
  useEffect(() => {
    if (pickedLocation) {
      setLocation(pickedLocation);
      clearPickedLocation();
    }
  }, [pickedLocation]);

  // Selección de fotos y videos
  const pickCoverMedia = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permiso necesario",
        "Concede acceso a tus fotos para añadir imágenes o videos.",
      );
      return;
    }

    const remainingSlots = MAX_MEDIA_ITEMS - mediaItems.length;
    if (remainingSlots <= 0) {
      Alert.alert(
        "Límite alcanzado",
        `Puedes añadir hasta ${MAX_MEDIA_ITEMS} fotos o videos con el plan Free.`,
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsMultipleSelection: true,
      selectionLimit: remainingSlots,
      videoMaxDuration: 30,
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled) {
      const picked: EventMediaItem[] = result.assets.map((asset) =>
        asset.type === "video"
          ? { type: "video", uri: asset.uri }
          : {
              type: "image",
              source: { uri: asset.uri },
              base64: asset.base64 ?? undefined,
            },
      );
      setMediaItems((prev) => [...prev, ...picked].slice(0, MAX_MEDIA_ITEMS));
    }
  };

  const removeMediaItem = (index: number) => {
    setMediaItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Fecha y hora combinada
  const combinedStartAt = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    startTime.getHours(),
    startTime.getMinutes(),
  ).toISOString();

  const isClosingNextDay =
    endTime.getHours() * 60 + endTime.getMinutes() <=
    startTime.getHours() * 60 + startTime.getMinutes();

  const closingDate = new Date(date);
  if (isClosingNextDay) closingDate.setDate(closingDate.getDate() + 1);

  const combinedClosingAt = new Date(
    closingDate.getFullYear(),
    closingDate.getMonth(),
    closingDate.getDate(),
    endTime.getHours(),
    endTime.getMinutes(),
  ).toISOString();

  const dateLabel = date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const isValid = Boolean(title.trim() && location);

  const handleSubmit = async () => {
    if (!isValid) {
      Alert.alert(
        "Faltan datos",
        "Por favor ingresa un título y una ubicación válida.",
      );
      return;
    }
    setSubmitting(true);
    try {
      const uploadedMedia = await Promise.all(
        mediaItems.map(async (item) => {
          if (item.type === "video") {
            const url = await uploadMediaToSupabase(item.uri, true);
            return { type: "video", uri: url } as EventMediaItem;
          } else {
            const uri =
              typeof item.source === "object" && "uri" in item.source
                ? item.source.uri
                : undefined;
            const base64 = item.base64;
            if (uri) {
              const url = await uploadMediaToSupabase(uri, false, base64);
              return { type: "image", source: { uri: url } } as EventMediaItem;
            }
            return item;
          }
        }),
      );

      const draft: Omit<EventItem, "id"> = {
        media: uploadedMedia,
        title: title.trim(),
        dateLabel,
        startAt: combinedStartAt,
        closingAt: combinedClosingAt,
        location: location?.address || "",
        latitude: location?.latitude ?? -12.0464,
        longitude: location?.longitude ?? -77.0428,
        description: description.trim(),
        category,
        typeMusic: musicTypes.join(", "),
        author: initialEvent?.author || user?.fullName || "Tú",
        authorAvatar: initialEvent?.authorAvatar || user?.imageUrl,
        attendeeAvatars: initialEvent?.attendeeAvatars ?? [],
        attendeeCount: initialEvent?.attendeeCount ?? 0,
        interestedCount: initialEvent?.interestedCount ?? 0,
        capacity,
        price:
          isFree || isMultiplePrices
            ? undefined
            : priceMen.trim() !== ""
              ? parseFloat(priceMen)
              : undefined,
        priceWomen:
          isFree || isMultiplePrices
            ? undefined
            : priceWomen.trim() !== ""
              ? parseFloat(priceWomen)
              : undefined,
        isMultiplePrices,
        isFreeEvent: isFree,
        contactMethod,
        contactPhone: contactPhone.trim(),
        externalTicketUrl:
          contactMethod === "external" ? externalTicketUrl.trim() : undefined,
        hideExactAddress,
        isGoing: true,
        isOwner: true,
        rating: 0,
        // Nuevos campos
        dressCode,
        dressCodeDetails: dressCodeDetails.trim(),
        corkageFree,
        openBar,
        isAdultsOnly,
        requirePhysicalId,
      };

      await onSubmit(draft);
    } catch (error: any) {
      console.error("Error al guardar evento:", error);
      Alert.alert(
        "Error al publicar",
        error?.message ||
          "Ocurrió un error al subir los archivos multimedia o guardar el evento.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      className="flex-1 bg-background"
    >
      {/* Barra de navegación superior con botón atrás */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-border/40">
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          className="size-9 rounded-full items-center justify-center active:opacity-75"
        >
          <Image
            source={icons.back}
            tintColor={colors.primary}
            className="size-7"
          />
        </Pressable>
        <Text className="text-xl font-bold text-primary">{screenTitle}</Text>
        <View className="size-9" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-4 pt-4 pb-10 gap-7"
      >
        {/* ================= 1. MULTIMEDIA Y PORTADA ================= */}
        <View className="gap-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-bold text-primary">Multimedia</Text>
            <Text className="text-xs font-bold text-muted-foreground">
              {mediaItems.length}/{MAX_MEDIA_ITEMS}
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-2"
          >
            {mediaItems.map((item, index) => (
              <View
                key={index}
                className="w-32 h-43 rounded-2xl overflow-hidden bg-modal-background relative"
              >
                <EventMediaCarousel
                  media={[item]}
                  className="w-full h-full"
                  resizeMode="cover"
                />

                {/* Badge Portada en la primera imagen */}
                {index === 0 && (
                  <View className="absolute top-2 left-2 bg-chip-background px-2 py-0.5 rounded-full z-10 shadow-sm">
                    <Text className="text-xs font-bold text-primary">
                      Portada
                    </Text>
                  </View>
                )}

                {/* Botón eliminar imagen */}
                <Pressable
                  className="absolute top-2 right-2 size-5 rounded-full bg-black/60 items-center justify-center z-10"
                  onPress={() => removeMediaItem(index)}
                  hitSlop={6}
                >
                  <Ionicons name="close" size={12} color="#ffffff" />
                </Pressable>
              </View>
            ))}

            {/* Tile para añadir foto o video */}
            {mediaItems.length < MAX_MEDIA_ITEMS && (
              <Pressable
                onPress={pickCoverMedia}
                className="w-32 h-43 rounded-2xl bg-modal-background border-none items-center justify-center active:opacity-75"
              >
                <View className="size-9 items-center justify-center">
                  <Image
                    source={icons.plus}
                    className="size-10"
                    tintColor={colors.primary}
                  />
                </View>
              </Pressable>
            )}
          </ScrollView>

          <Text className="text-xs font-regular text-muted-foreground leading-relaxed">
            Sube hasta {MAX_MEDIA_ITEMS} fotos/videos con el plan Free. La
            primera será la portada principal de tu evento.
          </Text>
        </View>

        {/* ================= 2. INFORMACIÓN BÁSICA ================= */}
        {/* Título del evento */}
        <View className="gap-4">
          <Text className="text-xl font-bold text-primary">
            Título del evento
          </Text>
          <TextInput
            className="bg-modal-background text-primary text-sm font-semibold px-3.5 py-3 rounded-xl border-none"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Tipo de evento (Categorías) */}
        <View className="gap-4">
          <Text className="text-xl font-bold text-primary">Tipo de evento</Text>
          <HorizontalChips
            items={EVENT_CATEGORY_ITEMS}
            selected={category}
            onSelect={setCategory}
          />
        </View>

        {/* Selector de Género Musical Múltiple */}
        <MusicTypeSelector selected={musicTypes} onChange={setMusicTypes} />

        {/* Detalles, Vibra y Reglas */}
        <View className="gap-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-bold text-primary">Detalles</Text>
            <Text className="text-[11px] text-muted-foreground font-medium">
              Obligatorio*
            </Text>
          </View>
          <TextInput
            className="bg-modal-background text-primary text-sm font-regular p-3.5 rounded-xl border-none min-h-[90px]"
            placeholder="Escribe aqui alguna descripción"
            placeholderTextColor={colors.mutedForeground}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            style={{ textAlignVertical: "top" }}
          />
        </View>

        {/* ================= 3. CÓDIGO DE VESTIMENTA ================= */}
        <DressCodeSection
          dressCode={dressCode}
          onDressCodeChange={setDressCode}
          dressCodeDetails={dressCodeDetails}
          onDressCodeDetailsChange={setDressCodeDetails}
        />

        {/* ================= 4. BENEFICIOS Y REQUISITOS (ANIMATED TOGGLE) ================= */}
        <EventFeaturesSection
          corkageFree={corkageFree}
          onCorkageFreeChange={setCorkageFree}
          openBar={openBar}
          onOpenBarChange={setOpenBar}
          isAdultsOnly={isAdultsOnly}
          onIsAdultsOnlyChange={setIsAdultsOnly}
          requirePhysicalId={requirePhysicalId}
          onRequirePhysicalIdChange={setRequirePhysicalId}
        />

        {/* ================= 5. FECHA Y HORARIOS ================= */}
        <DateTimeCard
          date={date}
          onDateChange={setDate}
          startTime={startTime}
          onStartTimeChange={setStartTime}
          endTime={endTime}
          onEndTimeChange={setEndTime}
        />

        {/* ================= 6. UBICACIÓN Y PRIVACIDAD ================= */}
        <LocationPrivacyCard
          location={location}
          hideExactAddress={hideExactAddress}
          onHideExactAddressChange={setHideExactAddress}
        />

        {/* ================= 7. MEDIOS DE CONTACTO ================= */}
        <ContactMethodCard
          contactMethod={contactMethod}
          onContactMethodChange={setContactMethod}
          externalUrl={externalTicketUrl}
          onExternalUrlChange={setExternalTicketUrl}
          contactPhone={contactPhone}
          onContactPhoneChange={setContactPhone}
        />

        {/* ================= 8. AFORO Y APORTACIÓN ================= */}
        <PricingAforoSection
          isFree={isFree}
          onIsFreeChange={(free) => {
            setIsFree(free);
            if (free) {
              setPriceMen("");
              setPriceWomen("");
            }
          }}
          isMultiplePrices={isMultiplePrices}
          onIsMultiplePricesChange={(multiple) => {
            setIsMultiplePrices(multiple);
            if (multiple) {
              setPriceMen("");
              setPriceWomen("");
            }
          }}
          priceMen={priceMen}
          onPriceMenChange={setPriceMen}
          priceWomen={priceWomen}
          onPriceWomenChange={setPriceWomen}
          capacity={capacity}
          onCapacityChange={setCapacity}
        />

        {/* ================= 9. BOTÓN DE PUBLICACIÓN ================= */}
        <Pressable
          className={
            isValid && !submitting
              ? "w-full bg-accent-pink py-4 rounded-2xl items-center justify-center shadow-lg shadow-accent-pink/20 active:opacity-85"
              : "w-full bg-modal-background py-4 rounded-2xl items-center justify-center border-none opacity-50"
          }
          onPress={handleSubmit}
          disabled={!isValid || submitting}
        >
          <Text
            className={
              isValid && !submitting
                ? "text-white font-bold text-lg"
                : "text-muted-foreground font-bold text-lg"
            }
          >
            {submitting ? submittingLabel : submitLabel}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

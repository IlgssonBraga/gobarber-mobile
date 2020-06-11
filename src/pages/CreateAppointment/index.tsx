import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import Icon from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

import {
    Container,
    Header,
    Content,
    BackButton,
    HeaderTitle,
    UserAvatar,
    ProvidersListContainer,
    ProvidersList,
    ProviderContainer,
    ProviderAvatar,
    ProviderName,
    Calendar,
    Title,
    OpenDatePickerButton,
    OpenDatePickerText,
    Schedule,
    Section,
    SectionTitle,
    SectionContent,
    Hour,
    HourText,
} from './styles';

export interface Provider {
    id: string;
    name: string;
    avatar_url: string;
}

interface RouteParams {
    providerId: string;
}

interface AvailabilityItem {
    hour: number;
    available: boolean;
}

const CreateAppointment: React.FC = () => {
    const route = useRoute();
    const routeParams = route.params as RouteParams;
    const [providers, setProviders] = useState<Provider[]>([]);
    const [selectedProvider, setSelectedProvider] = useState(
        routeParams.providerId,
    );
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedHour, setSelectedHour] = useState(0);
    const [availability, setAvailability] = useState<AvailabilityItem[]>([]);
    const { user } = useAuth();

    const { goBack } = useNavigation();

    useEffect(() => {
        api.get(`providers/${selectedProvider}/day-availability`, {
            params: {
                year: selectedDate.getFullYear(),
                month: selectedDate.getMonth() + 1,
                day: selectedDate.getDate(),
            },
        }).then((response) => {
            setAvailability(response.data);
        });
    }, [selectedDate, selectedProvider]);

    useEffect(() => {
        api.get('providers').then((response) => {
            setProviders(response.data);
        });
    }, []);

    const navigateBack = useCallback(() => {
        goBack();
    }, [goBack]);

    const handleProviderSelect = useCallback((providerId: string) => {
        setSelectedProvider(providerId);
    }, []);

    const handleToogleDatePicker = useCallback(() => {
        setShowDatePicker((state) => !state);
    }, []);

    const handleDateChange = useCallback(
        (event: any, date: Date | undefined) => {
            if (Platform.OS === 'android') {
                setShowDatePicker(false);
            }
            if (date) {
                setSelectedDate(date);
                setSelectedHour(0);
            }
        },
        [],
    );

    const morningAvailability = useMemo(() => {
        return availability
            .filter(({ hour }) => hour < 12)
            .map(({ hour, available }) => {
                return {
                    hour,
                    available,
                    hourFormatted: format(new Date().setHours(hour), 'HH:00'),
                };
            });
    }, [availability]);

    const afternoonAvailability = useMemo(() => {
        return availability
            .filter(({ hour }) => hour >= 12)
            .map(({ hour, available }) => {
                return {
                    hour,
                    available,
                    hourFormatted: format(new Date().setHours(hour), 'HH:00'),
                };
            });
    }, [availability]);

    const handleSelectHour = useCallback((hour: number) => {
        setSelectedHour(hour);
    }, []);

    return (
        <Container>
            <Header>
                <BackButton onPress={navigateBack}>
                    <Icon name="chevron-left" size={20} color="#999591" />
                </BackButton>
                <HeaderTitle>Cabeleleiro</HeaderTitle>
                <UserAvatar source={{ uri: user.avatar_url }} />
            </Header>

            <Content>
                <ProvidersListContainer>
                    <ProvidersList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={providers}
                        keyExtractor={(provider) => String(provider.id)}
                        renderItem={({ item: provider }) => (
                            <ProviderContainer
                                onPress={() =>
                                    handleProviderSelect(provider.id)
                                }
                                selected={provider.id === selectedProvider}
                            >
                                <ProviderAvatar
                                    source={{ uri: provider.avatar_url }}
                                />
                                <ProviderName
                                    selected={provider.id === selectedProvider}
                                >
                                    {provider.name}
                                </ProviderName>
                            </ProviderContainer>
                        )}
                    />
                </ProvidersListContainer>
                <Calendar>
                    <Title>Escolha a data</Title>

                    <OpenDatePickerButton onPress={handleToogleDatePicker}>
                        <OpenDatePickerText>
                            Selecionar outra data
                        </OpenDatePickerText>
                    </OpenDatePickerButton>
                    {showDatePicker && (
                        <DateTimePicker
                            mode="date"
                            display="calendar"
                            value={selectedDate}
                            textColor="#f4ede8"
                            onChange={handleDateChange}
                        />
                    )}
                </Calendar>

                <Schedule>
                    <Title>Escolha o horário</Title>

                    <Section>
                        <SectionTitle>Manhã</SectionTitle>
                        <SectionContent>
                            {morningAvailability.map(
                                ({ available, hour, hourFormatted }) => (
                                    <Hour
                                        enabled={available}
                                        selected={selectedHour === hour}
                                        available={available}
                                        key={hourFormatted}
                                        onPress={() => handleSelectHour(hour)}
                                    >
                                        <HourText
                                            selected={selectedHour === hour}
                                            key={hourFormatted}
                                        >
                                            {hourFormatted}
                                        </HourText>
                                    </Hour>
                                ),
                            )}
                        </SectionContent>
                    </Section>

                    <Section>
                        <SectionTitle>Tarde</SectionTitle>
                        <SectionContent>
                            {afternoonAvailability.map(
                                ({ available, hour, hourFormatted }) => (
                                    <Hour
                                        enabled={available}
                                        selected={selectedHour === hour}
                                        available={available}
                                        key={hourFormatted}
                                        onPress={() => handleSelectHour(hour)}
                                    >
                                        <HourText
                                            selected={selectedHour === hour}
                                            key={hourFormatted}
                                        >
                                            {hourFormatted}
                                        </HourText>
                                    </Hour>
                                ),
                            )}
                        </SectionContent>
                    </Section>
                </Schedule>
            </Content>
        </Container>
    );
};

export default CreateAppointment;

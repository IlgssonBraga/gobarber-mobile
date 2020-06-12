import styled from 'styled-components/native';
import { Platform } from 'react-native';

export const Container = styled.View`
    flex: 1;
    justify-content: center;
    padding: 0 30px ${Platform.OS === 'android' ? 150 : 40}px;
`;

export const Title = styled.Text`
    font-size: 20px;
    color: #f4ede8;
    font-family: 'RobotoSlab-Medium';
    margin: 24px 0;
`;

export const BackButton = styled.TouchableOpacity`
    margin-top: 40px;
`;

export const UserAvatarButton = styled.TouchableOpacity`
    margin-top: 20px;
`;

export const UserAvatar = styled.Image`
    width: 170px;
    height: 170px;
    border-radius: 85px;
    align-self: center;
`;

export const ButtonSignOut = styled.TouchableOpacity`
    width: 100%;
    height: 60px;
    background: #c2212e;
    border-radius: 10px;
    justify-content: center;
    align-items: center;
    margin-top: 15px;
`;
export const ButtonSignOutText = styled.Text`
    font-family: 'RobotoSlab-Medium';
    color: #f3ede8;
    font-size: 18px;
`;

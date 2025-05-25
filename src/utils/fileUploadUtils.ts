import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Alert, Linking, Platform } from 'react-native'; // Para exibir alertas simples de erro
import FileViewer from 'react-native-file-viewer'; // Para abrir o arquivo

// Diretório dentro do armazenamento da aplicação para guardar os uploads
// FileSystem.documentDirectory é o local persistente para arquivos do app
const UPLOADS_DIR = FileSystem.documentDirectory + 'traveler-uploads/';

/**
 * Garante que o diretório de uploads existe, criando-o se necessário.
 */
async function ensureUploadsDirExists() {
    const dirInfo = await FileSystem.getInfoAsync(UPLOADS_DIR);
    if (!dirInfo.exists) {
        console.log("Diretório de uploads não encontrado, criando...");
        await FileSystem.makeDirectoryAsync(UPLOADS_DIR, { intermediates: true });
    }
}

/**
 * Abre o seletor de arquivos do dispositivo, salva o arquivo selecionado localmente
 * e retorna o URI (caminho local) onde foi salvo.
 * @param allowedTypes - Array de tipos MIME permitidos (ex: ['application/pdf', 'image/*']). Use ['* /*'] para qualquer tipo.
 * @returns Promise<{ localUri: string, fileName: string } | null> - Retorna um objeto com o caminho local e nome original em sucesso, null se cancelado ou erro.
 */
export async function pickAndSaveDocument(allowedTypes: string[] = ['*/*']): Promise<{ localUri: string, fileName: string } | null> {
    try {
        // Garante que o diretório de destino existe
        await ensureUploadsDirExists();

        // Abre o seletor de documentos do dispositivo
        const result = await DocumentPicker.getDocumentAsync({
            type: allowedTypes, // Tipos de arquivo permitidos
            copyToCacheDirectory: true, // Copia o arquivo selecionado para o cache primeiro
        });

        // Verifica se o usuário cancelou a seleção
        if (result.canceled) {
            console.log('Seleção de documento cancelada');
            return null;
        }

        // Documento selecionado com sucesso
        const pickedFile = result.assets[0]; // Em versões recentes do picker, os resultados estão em 'assets'
        const originalUri = pickedFile.uri;
        const originalFileName = pickedFile.name || `documento_${Date.now()}`; // Nome original ou um nome padrão
        const fileExtension = originalFileName.split('.').pop() || 'dat'; // Pega a extensão

        // Gera um nome de arquivo único para evitar conflitos
        // Remova as marcações HTML e barras invertidas
        const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
        const localUri = UPLOADS_DIR + uniqueFileName; // Caminho completo onde o arquivo será salvo localmente

        // Copia o arquivo selecionado do local temporário para o diretório de uploads persistente da app
        await FileSystem.copyAsync({
            from: originalUri, // URI temporária do arquivo selecionado
            to: localUri, // URI de destino no armazenamento local da app
        });

        console.log('Arquivo salvo localmente:', localUri);

        // Retorna o caminho local onde o arquivo foi salvo e o nome original
        return { localUri, fileName: originalFileName };

    } catch (error) {
        console.error('Erro ao selecionar e salvar documento:', error);
        Alert.alert('Erro', 'Não foi possível selecionar e salvar o arquivo.'); // Alerta de erro para o usuário
        return null;
    }
}

export async function openLocalDocument(localUri: string) {
    if (!localUri) {
        Alert.alert('Erro', 'Caminho do arquivo não disponível.');
        return;
    }

    try {
        console.log('Tentando abrir o arquivo:', localUri);
        const fileInfo = await FileSystem.getInfoAsync(localUri);
        if (!fileInfo.exists) {
            Alert.alert('Erro', 'Arquivo não encontrado localmente.');
            console.error('Arquivo não encontrado no URI:', localUri);
            return;
        }

        let uriToOpen = localUri; // Por padrão, usa o URI local (funciona para iOS)

        // *** Passo crucial para Android: Converter file:// URI para content:// URI ***
        // Isso é necessário no Android 7.0+ para que outros apps possam acessar o arquivo.
        // FileSystem.getContentUriAsync() usa o FileProvider que o Expo configura.
        if (Platform.OS === 'android') {
            try {
                const contentUri = await FileSystem.getContentUriAsync(localUri);
                uriToOpen = contentUri;
                console.log('URI content:// para Android:', contentUri);
            } catch (contentUriError) {
                console.error('Erro ao obter content:// URI para Android:', contentUriError);
                Alert.alert('Erro', 'Não foi possível preparar o arquivo para abertura no Android.');
                return;
            }
        }

        // *** Tentar abrir o URI usando Linking.openURL() ***
        // Isso delega ao sistema operacional a tarefa de encontrar e abrir o app apropriado.
        const supported = await Linking.canOpenURL(uriToOpen);

        if (supported) {
            await Linking.openURL(uriToOpen);
            console.log('Arquivo aberto com Linking.openURL:', uriToOpen);
        } else {
            console.error(`Nenhum aplicativo pode abrir este tipo de arquivo: ${uriToOpen}`);
            Alert.alert('Erro', 'Nenhum aplicativo pode abrir este tipo de arquivo.');
        }

    } catch (error) {
        console.error('Erro geral ao abrir documento local (com Linking):', error);
        Alert.alert('Erro', 'Não foi possível abrir o arquivo.');
    }
}

/**
 * Opcional: Função para excluir um arquivo local salvo.
 * @param localUri - O URI (caminho local) do arquivo a ser excluído.
 */
export async function deleteLocalDocument(localUri: string) {
     if (!localUri) {
         console.warn("URI local do documento não fornecido para exclusão.");
         return;
     }
     try {
         const fileInfo = await FileSystem.getInfoAsync(localUri);
         if (fileInfo.exists) {
             await FileSystem.deleteAsync(localUri);
             console.log('Arquivo excluído:', localUri);
         } else {
              console.log('Arquivo não encontrado, não precisa excluir:', localUri);
         }
     } catch (error) {
          console.error('Erro ao excluir documento local:', error);
          Alert.alert('Erro', 'Não foi possível excluir o arquivo local.');
     }
}
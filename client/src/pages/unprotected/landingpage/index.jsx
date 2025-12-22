import { Helmet } from 'react-helmet-async';
import ProtectedRoute from '../../../components/protectedRoute';
import LandingPageWelcome from './components/welcome';
import LandingPageMateriais from './components/materiais';
import LandingPageAbout from './components/about';
import LandingPageQuestions from './components/questions';

export default function LandingPage() {
    return (
        <ProtectedRoute isPrivate={false}>
            <Helmet>
                <title>EduIA</title>
                <meta
                    name='description'
                    content='Sistema para geração de materiais de estudo e materiais de aula com inteligência artificial'
                />
            </Helmet>
            <main>
                <LandingPageWelcome />
                <LandingPageMateriais />
                <LandingPageAbout />
                <LandingPageQuestions />
            </main>
        </ProtectedRoute>
    );
}

import { Helmet } from 'react-helmet-async';
import LandingPageWelcome from './components/welcome';
import LandingPageMateriais from './components/materiais';
import LandingPageAbout from './components/about';

export default function LandingPage() {
    return (
        <>
            <Helmet>
                <title>EduIA</title>
                <meta
                    name='description'
                    content='Sistema para geração de materiais de estudo e materiais de aula com inteligência artificial'
                />
            </Helmet>
            <main>
                {/* Adicionar mais uma seção. Talvez sobre perguntas frequentes ou algo do tipo */}
                <LandingPageWelcome />
                <LandingPageMateriais />
                <LandingPageAbout />
            </main>
        </>
    );
}

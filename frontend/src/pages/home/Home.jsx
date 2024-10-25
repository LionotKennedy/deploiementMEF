
import React, { useEffect, useState } from 'react';
import "./home.scss"
import Chart from 'react-apexcharts'
import { useSelector } from 'react-redux'
import StatusCard from '../../components/status-card/StatusCard'
import { useGetFoldersByMonth } from '../../services/serviceFolder';
import { useCountFolders } from '../../services/serviceFolder';
import { getAllArchive } from '../../services/serviceArchive';
import { useGetVisa } from '../../services/serviceVisa';
import { useGetUser } from '../../services/serviceUser';
import Card from '../../components/progresbar/Card';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Calendar from '../../components/calendar/Calendar';

const Home = () => {
  const { data: monthData } = useGetFoldersByMonth();
  const [chartData, setChartData] = useState([]);
  const [chartCategories, setChartCategories] = useState([]);
  const themeReducer = useSelector(state => state.ThemeReducer.mode);

  const [archiveCount, setArchiveCount] = useState(0);
  const { data: archiveData, isLoading: isLoadingArchive, isError: isErrorArchive } = getAllArchive();

  const [visaCount, setVisaCount] = useState(0);
  const { data: visaData, isLoading: isLoadingVisa, isError: isErrorVisa } = useGetVisa();

  const [userCount, setUserCount] = useState(0);
  const { data: userData, isLoading: isLoadingUser, isError: isErrorUser } = useGetUser();

  const [folderCount, setFolderCount] = useState(0);
  const { data: folderData, isLoading: isLoadingFolder, isError: isErrorFolder } = useCountFolders();



  useEffect(() => {
    if (isLoadingFolder) {
      // console.log('Chargement des dossiers...');
      return;
    }

    if (isErrorFolder) {
      // console.error('Erreur lors de la récupération des dossiers');
      return;
    }

    if (folderData && typeof folderData.count === 'number') {
      // console.log('Nombre de dossiers:', folderData.count);
      setFolderCount(folderData.count);
    } else {
      // console.log("Données incorrectes ou manquantes dans la réponse de l'API");
      setFolderCount(0);
    }
  }, [folderData, isLoadingFolder, isErrorFolder]);


  useEffect(() => {
    if (isLoadingArchive) {
      // console.log('Chargement des archives...');
      return;
    }

    if (isErrorArchive) {
      // console.error('Erreur lors de la récupération des archives');
      return;
    }

    // Vérifiez les données des archives
    if (archiveData && Array.isArray(archiveData.data)) {
      // console.log('Données des archives:', archiveData.data);
      // console.log('Nombre des archives:', archiveData.data.length);
      setArchiveCount(archiveData.data.length);
    } else {
      // console.log("archiveData n'est pas un tableau :", archiveData);
      setArchiveCount(0);
    }
  }, [archiveData, isLoadingArchive, isErrorArchive]);


  useEffect(() => {
    if (isLoadingUser) {
      // console.log('Chargement des user...');
      return;
    }

    if (isErrorUser) {
      // console.error('Erreur lors de la récupération des user');
      return;
    }

    // Vérifiez les données des archives
    if (userData && Array.isArray(userData.data)) {
      // console.log('Données des user:', userData.data);
      // console.log('Nombre des user:', userData.data.length);
      setUserCount(userData.data.length);
    } else {
      // console.log("userData n'est pas un tableau :", userData);
      setUserCount(0);
    }
  }, [userData, isLoadingUser, isErrorUser]);


  useEffect(() => {
    if (isLoadingVisa) {
      // console.log('Chargement des visa...');
      return;
    }

    if (isErrorVisa) {
      // console.error('Erreur lors de la récupération des visa');
      return;
    }

    // Vérifiez les données des archives
    if (visaData && Array.isArray(visaData.data)) {
      // console.log('Données des visa:', visaData.data);
      // console.log('Nombre des visa:', visaData.data.length);
      setVisaCount(visaData.data.length);
    } else {
      // console.log("visaData n'est pas un tableau :", visaData);
      setVisaCount(0);
    }
  }, [visaData, isLoadingVisa, isErrorVisa]);


  useEffect(() => {
    if (monthData && monthData.success && Array.isArray(monthData.data.courrierByMonth)) {
      const folders = monthData.data.courrierByMonth;


      const sortedMonths = [...new Set(folders.map(folder => folder.month))].sort((a, b) => {
        const monthNames = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
        return monthNames.indexOf(a.toLowerCase()) - monthNames.indexOf(b.toLowerCase());
      });

      const chartData = sortedMonths.map(month => ({
        month,
        count: folders.filter(folder => folder.month === month).reduce((acc, curr) => acc + curr.count, 0)
      }));

      setChartData(chartData);
      setChartCategories(sortedMonths);
      // console.log("Folders data format:", folders.length); // Affiche le nombre de dossiers.
    } else {
      // console.log("No folders or incorrect data format:", monthData);
    }
  }, [monthData]);

  useEffect(() => {
    AOS.init({
      duration: 1000, // Durée des animations en millisecondes
      //   once: true,    // Pour que l'animation se joue une seule fois
    });
  }, []);

  const chartOptions = {
    series: [{
      name: 'Count',
      data: chartData.map(item => item.count),
    }],
    options: {
      color: ['#6ab04c', '#2980b9'],
      chart: {
        background: 'transparent'
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      xaxis: {
        categories: chartCategories
      },
      legend: {
        position: 'top'
      },
      grid: {
        show: false
      }
    }
  };


  const [statusCardsData, setStatusCardsData] = useState({
    archiveCount: 0,
    visaCount: 0,
    userCount: 0,
    folderCount: 0
  });

  const statusCards = [
    { title: "Total archive", field: "archiveCount" },
    { title: "Total visa", field: "visaCount" },
    { title: "Total utilisateur", field: "userCount" },
    { title: "Total courrier", field: "folderCount" }
  ];


  useEffect(() => {
    // Vérifiez les données des archives
    if (isLoadingArchive) {
      // console.log('Chargement des archives...');
      return;
    }

    if (isErrorArchive) {
      // console.error('Erreur lors de la récupération des archives');
      return;
    }

    if (archiveData && Array.isArray(archiveData.data)) {
      setStatusCardsData(prevState => ({
        ...prevState,
        archiveCount: archiveData.data.length
      }));
    } else {
      // console.log("archiveData n'est pas un tableau :", archiveData);
      setStatusCardsData(prevState => ({
        ...prevState,
        archiveCount: 0
      }));
    }
  }, [archiveData, isLoadingArchive, isErrorArchive]);

  useEffect(() => {
    // Vérifiez les données des visas
    if (isLoadingVisa) {
      // console.log('Chargement des visa...');
      return;
    }

    if (isErrorVisa) {
      // console.error('Erreur lors de la récupération des visa');
      return;
    }

    if (visaData && Array.isArray(visaData.data)) {
      setStatusCardsData(prevState => ({
        ...prevState,
        visaCount: visaData.data.length
      }));
    } else {
      // console.log("visaData n'est pas un tableau :", visaData);
      setStatusCardsData(prevState => ({
        ...prevState,
        visaCount: 0
      }));
    }
  }, [visaData, isLoadingVisa, isErrorVisa]);


  useEffect(() => {
    // Vérifiez les données des utilisateurs
    if (isLoadingUser) {
      // console.log('Chargement des user...');
      return;
    }

    if (isErrorUser) {
      // console.error('Erreur lors de la récupération des user');
      return;
    }

    if (userData && Array.isArray(userData.data)) {
      setStatusCardsData(prevState => ({
        ...prevState,
        userCount: userData.data.length
      }));
    } else {
      // console.log("userData n'est pas un tableau :", userData);
      setStatusCardsData(prevState => ({
        ...prevState,
        userCount: 0
      }));
    }
  }, [userData, isLoadingUser, isErrorUser]);

  useEffect(() => {
    if (isLoadingFolder) {
      // console.log('Chargement des dossiers...');
      return;
    }

    if (isErrorFolder) {
      // console.error('Erreur lors de la récupération des dossiers');
      return;
    }

    if (folderData && typeof folderData.count === 'number') {
      setStatusCardsData(prevState => ({
        ...prevState,
        folderCount: folderData.count
      }));
    } else {
      // console.log("Données incorrectes ou manquantes dans la réponse de l'API");
      setStatusCardsData(prevState => ({
        ...prevState,
        folderCount: 0
      }));
    }
  }, [folderData, isLoadingFolder, isErrorFolder]);


  return (
    <div>
      <h2 className="page-header">Dashboard</h2>
      <div className="row card_row">
        <div className="col-6 card_col">
          <div className="row">
            {
              statusCards.map((item, index) => (
                <div className="col-6" key={index} data-aos="fade-right">
                  <StatusCard
                    icon={getIcon(item.title)}
                    count={getItemValue(item.field)}
                    title={item.title}
                  />
                </div>
              ))
            }
          </div>
        </div>
        <div className="col-6">
          <div className="card full-height" data-aos="flip-right">
            {/* chart */}
            <Chart
              options={themeReducer === 'theme-mode-dark' ? {
                ...chartOptions.options,
                theme: { mode: 'dark' }
              } : {
                ...chartOptions.options,
                theme: { mode: 'light' }
              }}
              series={chartOptions.series}
              type='line'
              height='100%'
            />

          </div>
        </div>
        <div className="col-4" data-aos="slide-up">
          <div className="card">
            <div className="card__header">
              <h3>top Progrès</h3>
            </div>
            <div className="card__body">
            </div>
            <div className="card__footer">
              <Card title="Progrès" percentage={folderCount} />
            </div>
          </div>
        </div>
        <div className="col-8" data-aos="slide-left">
          <div className="card">
            <div className="card__body">
              <Calendar />
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  function getIcon(title) {
    const icons = {
      "Total archive": "bx bxs-archive",
      "Total visa": "bx bxs-folder-open",
      "Total utilisateur": "bx bxs-user-detail",
      "Total courrier": "bx bxs-receipt"
    };

    if (!icons[title]) {
      console.warn(`Aucune icône trouvée pour le titre "${title}"`);
      return "";
    }

    return icons[title];
  }

  function getItemValue(field) {
    const value = statusCardsData[field];
    return value < 10 ? `0${value}` : value;
  }

}


export default Home

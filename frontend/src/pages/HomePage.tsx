import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-blue-50">
      <h1 className="text-4xl font-bold mb-8">Ласкаво просимо!</h1>
      <div className="flex space-x-4">
        <button
          onClick={() => navigate('/login')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Увійти
        </button>
        <button
          onClick={() => navigate('/register')}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Зареєструватися
        </button>
      </div>
    </div>
  );
};

export default HomePage;

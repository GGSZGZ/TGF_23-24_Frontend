import { defineStore, createPinia } from 'pinia'

// Creamos la instancia de Pinia
const pinia = createPinia()

// Exportamos la tienda
export const useApiStore = defineStore('flashgaminghub', {
  state: () => ({
    token: localStorage.getItem('jwtToken') || null,
  }),
  actions: {
    async fetchPostLoginUser(user: any) {
      try {
        const response = await fetch('http://localhost:8001/Auth/Login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(user)
        })

        if (!response.ok) {
          console.error(`Error: ${response.status} - ${response.statusText}`)
          return null
        }

        const data = await response.text()
        const token = data

        return token
      } catch (error) {
        console.error('Error al enviar los datos:', error)
        return null
      }
    },
    async fetchPostRegisterUser(user: any,admin=false) {
      try {
        const response = await fetch('http://localhost:8001/Auth/Register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(user)
        })

        if (!response.ok) {
          console.error(`Error: ${response.status} - ${response.statusText}`)
          return null
        }

        const data = await response.text()
        const token = data
        if(admin==false){
        localStorage.setItem('jwtToken', token);
        }
        return token;

      } catch (error) {
        console.error('Error al enviar los datos:', error)
        return null
      }
    },
    //USER
    async fetchUsers() {
      try {
        if (!this.token) {
          console.error('No se encontró ningún token JWT en el localStorage');
          return;
        }
    
        const response = await fetch('http://localhost:8001/User', {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });
    
        if (!response.ok) {
          throw new Error('Error al obtener los datos');
        }
    
        const data = await response.json();
    
        // Verificar si la respuesta contiene datos válidos
        if (!data || !Array.isArray(data)) {
          throw new Error('La respuesta no contiene datos válidos');
        }
    
        return data;
      } catch (error: any) {
        console.error('Error al obtener los datos:', error.message);
        throw error;
      }
    },
    async fetchUser(id: number) {
      try {

        if (!this.token) {
          console.error('No se encontró ningún token JWT en el localStorage')
          return
        }

        const response = await fetch(`http://localhost:8001/User/${id}`, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })
        if (!response.ok) {
          throw new Error('Error al obtener los datos')
        }
        return await response.json()
      } catch (error: any) {
        // console.error('Error al obtener los datos:', error.message)
        // throw error
      }
    },
    async fetchMessagesUser(id: number) {
      try {

        if (!this.token) {
          console.error('No se encontró ningún token JWT en el localStorage')
          return
        }

        const response = await fetch(`http://localhost:8001/User/${id}/messages`, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })
        if (response.status === 404) {
          return [];
        }
        if (!response.ok) {
          return 'No se han encontrado mensajes de este usuario'
        }
        return await response.json()
      } catch (error: any) {
        console.error('Error al obtener los datos:', error.message)
        throw error
      }
    },
    async fetchDeleteUser(id: number) {
      try {

        if (!this.token) {
          console.error('No se encontró ningún token JWT en el localStorage')
          return
        }

        const response = await fetch(`http://localhost:8001/User/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })
        if (!response.ok) {
          throw new Error('Error al eliminar el usuario')
        }
        return 'Usuario eliminado correctamente'
      } catch (error: any) {
        console.error('Error al eliminar el usuario:', error.message)
        throw error
      }
    },
    async fetchUpdateUser(id: number, userData: any) {
      const tokenUpdated=localStorage.getItem('jwtToken');
      try {
        if (!this.token) {
          console.error('No se encontró ningún token JWT en el localStorage');
          return;
        }

        const formattedUserData: { [key: string]: any } = {};
        Object.keys(userData).forEach(key => {
          formattedUserData[key] = userData[key];
        });
        const response = await fetch(`http://localhost:8001/User/${id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${tokenUpdated}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formattedUserData)
        });
    
        if (!response.ok) {
          throw new Error('Error al actualizar el elemento')
          
        }
        const responseBody = await response.text();
        
        
        if (!responseBody) {
          return null;
        }
    
        return JSON.parse(responseBody);
      } catch (error: any) {
        
        console.error('Error al actualizar el elemento:', error.message);
        throw error;
      }
    },
    //END USER
    //STUDIO
    async fetchStudios(name?: string, country?: string) {
      try {
    
        let url = 'http://localhost:8001/Studio';
        if (name !== undefined) {
          url += `?name=${name}`;
        } else if (country !== undefined) {
          url += `?country=${country}`;
        }
    
        const response = await fetch(url);
    
        if (!response.ok) {
          throw new Error('Error al obtener los datos');
        }
    
        const data = await response.json();
    
        // Verificar si la respuesta contiene datos válidos
        if (!data || !Array.isArray(data)) {
          throw new Error('La respuesta no contiene datos válidos');
        }
    
        return data;
      } catch (error: any) {
        console.error('Error al obtener los datos:', error.message);
        throw error;
      }
    },
    async fetchStudio(id: number) {
      try {
        const response = await fetch(`http://localhost:8001/Studio/${id}`);
        if (!response.ok) {
          throw new Error('Error al obtener los datos')
        }
        const studioData = await response.json();
        localStorage.setItem("studioGame", JSON.stringify(studioData));
        return studioData;
      } catch (error: any) {
        console.error('Error al obtener los datos:', error.message)
        throw error
      }
    },
    async fetchGamesStudio(id: number) {
      try {
        const response = await fetch(`http://localhost:8001/Studio/${id}/games`);
        if (!response.ok) {
          throw new Error('Error al obtener los datos')
        }
        return await response.json()
      } catch (error: any) {
        console.error('Error al obtener los datos:', error.message)
        throw error
      }
    },
    async fetchPostStudio(studioData:any) {
      try {
        
        const url = 'http://localhost:8001/Studio';
    
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(studioData)
        });
    
        if (!response.ok) {
          throw new Error('Error al crear el estudio');
        }
    
        const createdStudio = await response.json();
    
        return createdStudio;
      } catch (error: any) {
        console.error('Error al crear el estudio:', error.message);
        throw error;
      }
    },
    async fetchDeleteStudio(id: number) {
      try {

        if (!this.token) {
          console.error('No se encontró ningún token JWT en el localStorage')
          return
        }

        const response = await fetch(`http://localhost:8001/Studio/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })
        if (!response.ok) {
          throw new Error('Error al eliminar el elemento')
        }
        return 'Usuario eliminado correctamente'
      } catch (error: any) {
        console.error('Error al eliminar el elemento:', error.message)
        throw error
      }
    },
    async fetchUpdateStudio(id: number, studioData: any) {
       
      try {

        const formattedStudioData: { [key: string]: any } = {};
        Object.keys(studioData).forEach(key => {
          formattedStudioData[key] = studioData[key];
        });
        const response = await fetch(`http://localhost:8001/Studio/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formattedStudioData)
        });
    
        if (!response.ok) {
          throw new Error('Error al actualizar el elemento')
          
        }
        const responseBody = await response.text();
        if (!responseBody) {
          return null;
        }
    
        return JSON.parse(responseBody);
      } catch (error: any) {
        
        console.error('Error al actualizar el elemento:', error.message);
        throw error;
      }
    },
    //END STUDIO
    //ShoppingCart
    async fetchShoppingCart(id: number) {
      try {

        if (!this.token) {
          console.error('No se encontró ningún token JWT en el localStorage')
          return
        }

        const response = await fetch(`http://localhost:8001/ShoppingCart/${id}`, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })
        if (!response.ok) {
          throw new Error('Error al obtener los datos')
        }
        return await response.json()
      } catch (error: any) {
        console.error('Error al obtener los datos:', error.message)
        throw error
      }
    },
    
    async fetchPostShoppingCart(shoppingCartData:any) {
      try {
        
        const url = 'http://localhost:8001/ShoppingCart';
    
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
          },
          body: JSON.stringify(shoppingCartData)
        });
    
        if (!response.ok) {
          throw new Error('Error al crear el estudio');
        }
    
        const createdStudio = await response.json();
    
        return createdStudio;
      } catch (error: any) {
        console.error('Error al crear el estudio:', error.message);
        throw error;
      }
    },
    
    async fetchUpdateShoppingCart(id: number, shoppingCartData: any) {
       
      try {
        if (!this.token) {
          console.error('No se encontró ningún token JWT en el localStorage');
          return;
        }

        const formattedStudioData: { [key: string]: any } = {};
        Object.keys(shoppingCartData).forEach(key => {
          formattedStudioData[key] = shoppingCartData[key];
        });
        const response = await fetch(`http://localhost:8001/ShoppingCart/${id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formattedStudioData)
        });
    
        if (!response.ok) {
          throw new Error('Error al actualizar el elemento')
          
        }
        const responseBody = await response.text();
        if (!responseBody) {
          return null;
        }
    
        return JSON.parse(responseBody);
      } catch (error: any) {
        
        console.error('Error al actualizar el elemento:', error.message);
        throw error;
      }
    },
    async fetchDeleteShoppingCart(id: number) {
      try {

        if (!this.token) {
          console.error('No se encontró ningún token JWT en el localStorage')
          return
        }

        const response = await fetch(`http://localhost:8001/ShoppingCart/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })
        if (!response.ok) {
          throw new Error('Error al eliminar el elemento')
        }
        return 'ShoppingCart eliminado correctamente'
      } catch (error: any) {
        console.error('Error al eliminar el elemento:', error.message)
        throw error
      }
    },
    async fetchPostGameShoppingCart(ShoppingCartID:number, gameId:number) {
      try {
        if (!this.token) {
          console.error('No se encontró ningún token JWT en el localStorage');
          return;
        }
        const response = await fetch(`http://localhost:8001/ShoppingCart/${ShoppingCartID}/games/${gameId}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });
        if (!response.ok) {
          return 'Game already added';
        }
        return 'Juego añadido al carrito correctamente';
      } catch (error : any) {
        console.error('Error al añadir el juego al carrito:', error.message);
        throw error;
      }
    },
    async fetchDeleteGameShoppingCart(ShoppingCartID: number, gameId: number) {
      try {
        if (!this.token) {
          console.error('No se encontró ningún token JWT en el localStorage');
          return;
        }
    
        const response = await fetch(`http://localhost:8001/ShoppingCart/${ShoppingCartID}/games/${gameId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });
    
        if (!response.ok) {
          throw new Error('Error al eliminar el juego del carrito');
        }
    
        return 'Juego eliminado del carrito correctamente';
      } catch (error: any) {
        console.error('Error al eliminar el juego del carrito:', error.message);
        throw error;
      }
    },
    async fetchGamesShoppingCart(id: number) {
      try {
        if (!this.token) {
          console.error('No se encontró ningún token JWT en el localStorage');
          return;
        }
    
        const response = await fetch(`http://localhost:8001/ShoppingCart/${id}/games`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });
    
        if (!response.ok) {
          throw new Error('Error al obtener los juegos del carrito');
        }
    
        const gamesInCart = await response.json();
        return gamesInCart;
      } catch (error: any) {
        console.error('Error al obtener los juegos del carrito:', error.message);
        throw error;
      }
    },
    
    //END ShoppingCart
    //LibraryGameUser
    async fetchLibraryGameUsers() {
      try {
        if (!this.token) {
          console.error('No se encontró ningún token JWT en el localStorage');
          return;
        }
        const response = await fetch('http://localhost:8001/LibraryGameUser', {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });
    
        if (!response.ok) {
          throw new Error('Error al obtener los datos');
        }
    
        const data = await response.json();
    
        // Verificar si la respuesta contiene datos válidos
        if (!data || !Array.isArray(data)) {
          throw new Error('La respuesta no contiene datos válidos');
        }
    
        return data;
      } catch (error: any) {
        console.error('Error al obtener los datos:', error.message);
        throw error;
      }
    },
    async fetchLibraryGameUser(id: number) {
      try {

        if (!this.token) {
          console.error('No se encontró ningún token JWT en el localStorage')
          return
        }

        const response = await fetch(`http://localhost:8001/LibraryGameUser/${id}`, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })
        if (!response.ok) {
          throw new Error('Error al obtener los datos')
        }
        return await response.json()
      } catch (error: any) {
        console.error('Error al obtener los datos:', error.message)
        throw error
      }
    },
    async fetchGamesLibraryGameUser(id: number) {
      try {

        if (!this.token) {
          console.error('No se encontró ningún token JWT en el localStorage')
          return
        }

        const response = await fetch(`http://localhost:8001/LibraryGameUser/${id}/games`, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })
        if (!response.ok) {
          throw new Error('Error al obtener los datos')
        }
        return await response.json()
      } catch (error: any) {
        return('No Games');
      }
    },
    async fetchPostLibraryGameUser(libraryGameUserData:any) {
      try {
        
        const url = 'http://localhost:8001/LibraryGameUser';
    
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
          },
          body: JSON.stringify(libraryGameUserData)
        });
    
        if (!response.ok) {
          throw new Error('Error al crear el elemento');
        }
    
        const createdStudio = await response.json();
    
        return createdStudio;
      } catch (error: any) {
        console.error('Error al crear el elemento:', error.message);
        throw error;
      }
    },
    async fetchUpdateLibraryGameUser(id: number, libraryGameUserData: any) {
       
      try {
        if (!this.token) {
          console.error('No se encontró ningún token JWT en el localStorage');
          return;
        }

        const formattedLibraryGameUserData: { [key: string]: any } = {};
        Object.keys(libraryGameUserData).forEach(key => {
          formattedLibraryGameUserData[key] = libraryGameUserData[key];
        });
        const response = await fetch(`http://localhost:8001/LibraryGameUser/${id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formattedLibraryGameUserData)
        });
    
        if (!response.ok) {
          throw new Error('Error al actualizar el elemento')
          
        }
        const responseBody = await response.text();
        if (!responseBody) {
          return null;
        }
    
        return JSON.parse(responseBody);
      } catch (error: any) {
        
        console.error('Error al actualizar el elemento:', error.message);
        throw error;
      }
    },
    async fetchDeleteLibraryGameUser(id: number) {
      try {

        if (!this.token) {
          console.error('No se encontró ningún token JWT en el localStorage')
          return
        }

        const response = await fetch(`http://localhost:8001/LibraryGameUser/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })
        if (!response.ok) {
          throw new Error('Error al eliminar el elemento')
        }
        return 'ShoppingCart eliminado correctamente'
      } catch (error: any) {
        console.error('Error al eliminar el elemento:', error.message)
        throw error
      }
    },
    async fetchPostGameLibraryGameUser(LibraryGameUserID:number, gameId:number) {
      try {
        if (!this.token) {
          console.error('No se encontró ningún token JWT en el localStorage');
          return;
        }
        const response = await fetch(`http://localhost:8001/LibraryGameUser/${LibraryGameUserID}/games/${gameId}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });
        if (!response.ok) {
          return 'Game already added';
        }
        return 'Juego añadido a la biblioteca correctamente';
      } catch (error : any) {
        console.error('Error al añadir el juego a la biblioteca:', error.message);
        throw error;
      }
    },
    //End LibraryGameUser
    //GAMESHOP
    async fetchGameShops() {
      try {
        if (!this.token) {
          console.error('No se encontró ningún token JWT en el localStorage');
          return;
        }
        const response = await fetch('http://localhost:8001/GameShop', {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });
    
        if (!response.ok) {
          throw new Error('Error al obtener los datos');
        }
    
        const data = await response.json();
    
        // Verificar si la respuesta contiene datos válidos
        if (!data || !Array.isArray(data)) {
          throw new Error('La respuesta no contiene datos válidos');
        }
    
        return data;
      } catch (error: any) {
        console.error('Error al obtener los datos:', error.message);
        throw error;
      }
    },
    async fetchGameShop(id: number) {
      try {

        if (!this.token) {
          console.error('No se encontró ningún token JWT en el localStorage')
          return
        }

        const response = await fetch(`http://localhost:8001/GameShop/${id}`, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })
        if (!response.ok) {
          throw new Error('Error al obtener los datos')
        }
        return await response.json()
      } catch (error: any) {
        console.error('Error al obtener los datos:', error.message)
        throw error
      }
    },
    async fetchGamesGameShop(id: number, category?: string, price?: number, orderDate?: string, orderPrice?: string, orderName?: string) {
      try {
        let url = `http://localhost:8001/GameShop/${id}/games`;
        const params = new URLSearchParams();
    
        if (category !== undefined) {
          params.append('category', category);
        }
        if (price !== undefined) {
          params.append('price', price.toString());
        }
        if (orderDate !== undefined) {
          params.append('orderDate', orderDate);
        }
        if (orderPrice !== undefined) {
          params.append('orderPrice', orderPrice);
        }
        if (orderName !== undefined) {
          params.append('orderName', orderName);
        }
    
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
    
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Error al obtener los datos');
        }
        return await response.json();
      } catch (error: any) {
        console.error(error.message);
      }
    },
    
    async fetchPostGameShop(gameShopData:any) {
      try {
        if (!this.token) {
          console.error('No se encontró ningún token JWT en el localStorage');
          return;
        }
        
        const url = 'http://localhost:8001/GameShop';
    
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`
          },
          body: JSON.stringify(gameShopData)
        });
    
        if (!response.ok) {
          throw new Error('Error al crear el elemento');
        }
    
        const createdStudio = await response.json();
    
        return createdStudio;
      } catch (error: any) {
        console.error('Error al crear el elemento:', error.message);
        throw error;
      }
    },
    async fetchUpdateGameShop(id: number, gameShopData: any) {
       
      try {
        const formattedGameShopData: { [key: string]: any } = {};
        Object.keys(gameShopData).forEach(key => {
          formattedGameShopData[key] = gameShopData[key];
        });
        const response = await fetch(`http://localhost:8001/GameShop/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formattedGameShopData)
        });
    
        if (!response.ok) {
          throw new Error('Error al actualizar el elemento')
          
        }
        const responseBody = await response.text();
        if (!responseBody) {
          return null;
        }
    
        return JSON.parse(responseBody);
      } catch (error: any) {
        
        console.error('Error al actualizar el elemento:', error.message);
        throw error;
      }
    },
    async fetchDeleteGameShop(id: number) {
      try {

        if (!this.token) {
          console.error('No se encontró ningún token JWT en el localStorage')
          return
        }

        const response = await fetch(`http://localhost:8001/GameShop/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })
        if (!response.ok) {
          throw new Error('Error al eliminar el elemento')
        }
        return 'ShoppingCart eliminado correctamente'
      } catch (error: any) {
        console.error('Error al eliminar el elemento:', error.message)
        throw error
      }
    },
    //End GAMESHOP
    //GAME
    async fetchGames() {
      try {
        const response = await fetch('http://localhost:8001/Game');
    
        if (!response.ok) {
          throw new Error('Error al obtener los datos');
        }
    
        const data = await response.json();
    
        // Verificar si la respuesta contiene datos válidos
        if (!data || !Array.isArray(data)) {
          throw new Error('La respuesta no contiene datos válidos');
        }
    
        return data;
      } catch (error: any) {
        console.error('Error al obtener los datos:', error.message);
        throw error;
      }
    },
    async fetchGame(id: number) {
      try {
        const response = await fetch(`http://localhost:8001/Game/${id}`);
        if (!response.ok) {
          throw new Error('Error al obtener los datos')
        }
        // const gameData = await response.json();
        // localStorage.setItem("currentGame", JSON.stringify(gameData));
        return await response.json();
      } catch (error: any) {
        console.error('Error al obtener los datos:', error.message)
        throw error
      }
    },
    async fetchPostGame(gameData:any) {
      try {
        const url = 'http://localhost:8001/Game';
    
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(gameData)
        });
    
        if (!response.ok) {
          throw new Error('Error al crear el elemento');
        }
    
        const createdStudio = await response.json();
    
        return createdStudio;
      } catch (error: any) {
        console.error('Error al crear el elemento:', error.message);
        throw error;
      }
    },
    async fetchUpdateGame(id: number, gameData: any) {
       
      try {

        const formattedGameData: { [key: string]: any } = {};
        Object.keys(gameData).forEach(key => {
          formattedGameData[key] = gameData[key];
        });
        const response = await fetch(`http://localhost:8001/Game/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formattedGameData)
        });
    
        if (!response.ok) {
          throw new Error('Error al actualizar el elemento')
          
        }
        const responseBody = await response.text();
        if (!responseBody) {
          return null;
        }
    
        return JSON.parse(responseBody);
      } catch (error: any) {
        
        console.error('Error al actualizar el elemento:', error.message);
        throw error;
      }
    },
    async fetchDeleteGame(id: number) {
      try {

        const response = await fetch(`http://localhost:8001/Game/${id}`, {
          method: 'DELETE'
        })
        if (!response.ok) {
          throw new Error('Error al eliminar el elemento')
        }
        return 'ShoppingCart eliminado correctamente'
      } catch (error: any) {
        console.error('Error al eliminar el elemento:', error.message)
        throw error
      }
    },
    //End GAME
    //COMMUNITY
    async fetchCommunities() {
      try {
        if (!this.token) {
          console.error('No se encontró ningún token JWT en el localStorage');
          return;
        }
        const response = await fetch('http://localhost:8001/Community', {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });
    
        if (!response.ok) {
          throw new Error('Error al obtener los datos');
        }
    
        const data = await response.json();
    
        // Verificar si la respuesta contiene datos válidos
        if (!data || !Array.isArray(data)) {
          throw new Error('La respuesta no contiene datos válidos');
        }
    
        return data;
      } catch (error: any) {
        console.error('Error al obtener los datos:', error.message);
        throw error;
      }
    },
    async fetchCommunity(id: number) {
      try {

        if (!this.token) {
          console.error('No se encontró ningún token JWT en el localStorage')
          return
        }

        const response = await fetch(`http://localhost:8001/Community/${id}`, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })
        if (!response.ok) {
          throw new Error('Error al obtener los datos')
        }
        return await response.json()
      } catch (error: any) {
        console.error('Error al obtener los datos:', error.message)
        throw error
      }
    },
    async fetchPostCommunity(communityData:any) {
      try {
        if (!this.token) {
          console.error('No se encontró ningún token JWT en el localStorage');
          return;
        }
        
        const url = 'http://localhost:8001/Community';
    
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`
          },
          body: JSON.stringify(communityData)
        });
    
        if (!response.ok) {
          throw new Error('Error al crear el elemento');
        }
    
        const createdStudio = await response.json();
    
        return createdStudio;
      } catch (error: any) {
        console.error('Error al crear el elemento:', error.message);
        throw error;
      }
    },
    async fetchUpdateCommunity(id: number, communityData: any) {
       
      try {
        if (!this.token) {
          console.error('No se encontró ningún token JWT en el localStorage');
          return;
        }

        const formattedCommunityData: { [key: string]: any } = {};
        Object.keys(communityData).forEach(key => {
          formattedCommunityData[key] = communityData[key];
        });
        const response = await fetch(`http://localhost:8001/Community/${id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formattedCommunityData)
        });
    
        if (!response.ok) {
          throw new Error('Error al actualizar el elemento')
          
        }
        const responseBody = await response.text();
        if (!responseBody) {
          return null;
        }
    
        return JSON.parse(responseBody);
      } catch (error: any) {
        
        console.error('Error al actualizar el elemento:', error.message);
        throw error;
      }
    },
    async fetchDeleteCommunity(id: number) {
      try {

        if (!this.token) {
          console.error('No se encontró ningún token JWT en el localStorage')
          return
        }

        const response = await fetch(`http://localhost:8001/Community/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })
        if (!response.ok) {
          throw new Error('Error al eliminar el elemento')
        }
        return 'ShoppingCart eliminado correctamente'
      } catch (error: any) {
        console.error('Error al eliminar el elemento:', error.message)
        throw error
      }
    },
    //End COMMUNITY
  }
})

export { pinia }

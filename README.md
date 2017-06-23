# Digital Wallet 

## Define Requirements 

### Functional Requirements:
* Users should be able to perform `create`, `getAll`, `get`, `update`, and `delete` from their wallet
* Users should be able to navigate to `wallets`, `addWallet`, `manageWallet` views and perform various above user actions 

### Non-Functional Requirements
* The system needs to be highly **reliable**
    * Any uploaded credit cards can NOT be lost.
* The system needs to be highly **available** 
    * Provide desktop app, or potential native app alternative solutions (improve availability with many alternative options)
    * Provide offline support with the ability to add/delete/update/get files while offline, and as soon as they come online, all their changes should be synced to the remote servers and other online services(improve availability and user experience)
* The system needs to be highly **secured**, since we're dealing with confidential users data
    * Secure Http Requests with payload encryption and decryption
* The system needs to be highly **consistency** and **easy-to-use** (Focus on providing best users experience)
    * Adaptive/Responsive UI designs (focus on all browsers, includes cellphones browsers support) 
    * Provide accessibility support for disabled users
    * Provide internationalization capability (improve accessibility and user experience)         
* Provide system cache mechanism support 
    * UI: add cache support to reduce redundant API requests 
    * Server: add cache support to potentially all `GET` requests (since majority of users actions will be `GET` or `GET ALL`)   

## System interface definition
* wallet.create(params):
    * Name: create
    * Description: create a new credit card record and add it to that particular user's wallet
    * Parameters: params, which includes `userFirstName`, `userLastName`, `creditCardNumber`, `expirationDate`, `CSC`
    * Returns: return a JSON object that contains the newly created credit card
* wallet.getAll():
    * Name: getAll
    * Description: Retrieve all credit cards records from that particular users's wallet
    * Parameters: none
    * Returns: return a JSON object that contains a list of credit card records
* wallet.get(id):
    * Name: get
    * Description: Retrieve one credit card record from that particular user's wallet
    * Parameters: id(number), the `credit card id` from that particular user's wallet
    * Returns: return a JSON object that contains that particular `credit card` 
* wallet.update(id):
    * Name: update
    * Description: Update a credit card record from that particular user's wallet
    * Parameters: id(number), the `credit card id` that represents the credit card record
    * Returns: return a JSON object that contains the newly `updated` version of the credit card
* wallet.delete(id): 
    * Name: delete
    * Description: Delete a credit card record from that particular user's wallet
    * Parameters: id(number), the `credit card id` that represents the credit card record
    * Returns: return a JSON object that contains the information that whether this particular credit card has been deleted successfully or not.

### Capacity and Scale Estimation 
* What scale is expected from the system and how much storage would we expect? (Potentially globally)
    * Let's assume we have `200M` total users, and `40M` daily active users (DAU)
    * Let's assume that on average each users connects to `3` different devices (browsers, desktop, native devices app)
    * Let's assume on average every user stores `3` credit cards records, we will have `600M` credit cards records 
    * Let's assume that average credit card record size is `2KB`
    * Total Storage: `Record Size(avg)` * `Total Records` = 2KB * 600M = `1.2 terabytes`
* What network bandwidth usage are we expecting? This can be crucial in deciding how would we manage `high traffic` and balance load between servers.
    * How about third world countries where internet is a lot slower? How can we provide the same user experience vs. viewing from the States?
    * How about `Gloud file storage` to enable users to store their data on remote servers?

### Database Schema
* User Model: 
    * UserID: int, 
    * UserFirstName: varchar(20), 
    * UserLastName: varchar(20), 
    * UserEmail: varchar(32), 
    * DateOfBirth: datetime, 
    * Address: varchar(80): 
    * CreationData: datetime
    * LastLogin: datetime    
* CreditCard Model: 
    * CardID (not the actual credit card id): int, 
    * UserFirstName: varchar(20), 
    * UserLastName: varchar(20), 
    * ActualCreditCardID (actual 16 digits): varchar(16), 
    * CreditCardExpirationDate (MM/YY): varchar(5), 
    * CreditCardCSC(3 digits): varchar(3)
    * type: varchar()
We need to store data about `users`, and their `uploaded` credit cards. One simple approach for storing the above schema would be to use an SQL like MySQL since we requires joins. But relational database come with their challenges especially when we need to scale them.
We also need to understand how to store those data, as well as what type of database we would like to store them (NoSQL)
 
With that said, we can try to store the above schema in a distributed `key-value` store to enjoy benefits offered by `NoSQL`. We can break our `CreditCard` table into `two` key-value store tables:
    1. `CreditCard` table to store the actual credit card number. The `key` would be the `CardID`, and `value` would be the actual `CreditCardID` (16 digits).
    2. `CredtiCardMetadata` table to store all the metadata information about a credit card, where the `key` would be `CardID` and `value` would be an object that containing `UserFirstName`, `UserLastName`, `CreditCardExpirationDate` and etc.
    
We also need to store relationship between `users` and `credit cards`, to know who owns which credit cards. For this kind of table, we can use a `wide-column` datastore like `Cassandra`.
    1. `UserCreditCard` table to store the relationship. The `key` would be the `UserID`, and `value` would be the list of `CredCardsIDs` the users owns, stored in different column.
      
Reasons behind choosing `Cassandra` and `key-value` stores is generally those stores maintain a certain number of `replicas` to offer reliability. More importantly, `deletes` actions don't get applied instantly, data is retrained for certain days (to support undeleting) before getting removed from the system permanently.
  
### High Level System Designs 

### Detail Component Designs 

### Reliability and Redundancy 
Losing files is not an option for our service. Therefore, we will store multiple copies of each record, so that if one storage server dies, we can retrieve the credit card from the other copy present on a different storage server.
If we want to have **high availability** of the system, we need to have multiple replicas of services running in the system. So that if a few services die down, the system is still available and serving.


### Cache and Load Balancing 

### Security and Permission 

### Identifying and resolving bottlenecks
* Is there any single point of failure in our system? What/How are doing to mitigate it?
* Do we have enough replicas of the data so that if we lose a few servers, we can still serve our users?
* Do we have enough copies of different services running, such that a few failures will not cause total system shutdown?
* How are we monitoring the performance of our service? Do we get alerts whenever critical components fail or their performance degrade?


## UI DOCUMENTATION
### Stacks: Angular4, Webpack, RxJS, ngrx/store, ngrx/effects, Immutable.js, Redux, Karma(Jasmine), SASS, TypeScript and Electron   

### Observable based Redux (Actions, Reducers/Selectors, Observable Store, SideEffects)
* Actions:
    * getAllCards() -> Action { type, payload }
    * getAllCardsFulfilled() -> Action { type, payload }
    * getAllCardsFailed() -> Action { type, payload } 
    * updateSelectedCreditCard() -> Action { type, payload }        
    * updateSelectedState() -> Action { type, payload } 
    * createCard() -> Action { type, payload } 
    * createCardFailed() -> { type, payload }
    * createCardFulfilled() -> { type, payload }   
    * updateCardFulfilled() -> { type, payload }   
    * deleteCardFulfilled() -> { type, payload }
    * deleteCardFailed() -> { type, payload }
    
* Reducer (pure function with Immutable.js as its data type):
    * `walletReducer` listens on a few actions that returns a new state:
        ** `WalletActions.GET_ALL_CARDS_FULFILLED`: when successfully get a list of credit cards
        ** `WalletActions.GET_CARD_FAILED`: when it fails get a credit card detail
        ** `WalletActions.CREATE_CARD_FULFILLED`: when successfully create a credit card
        ** `WalletActions.CREATE_CARD_FAILED`: when it creates a credit card
        ** `WalletActions.UPDATED_SELECTED_STATE`: maintain the current selected state from `wallet`, `add`, `manage`, and `update`
        ** `WalletActions.UPDATED_SELECTED_CREDIT_CARD`: get a credit full detail and store it our `store` as the selected credit card
        ** `WalletActions.UPDATE_CARD_FULFILLED`: successfully update an existing credit card
        ** `WalletActions.UPDATE_CARD_FAILED`: fail updating a credit card
        ** `WalletActions.DELETE_CARD_FULFILLED`: successfully remove a credit card
        ** `WalletActions.DELETE_CARD_FAILED`: failed remove a credit card
    * `Selectors` which retrieves a subset of data piece from your observable store
        ** getWalletState(state$: Store<AppState>): Observable<CurrentWalletState>
        ** getWalletSelectedState(state$: Store<AppState>): Observable<string>
        ** getWalletCreditCards(state$: Store<AppState>): Observable<any>
        ** getWalletCreditCardsCount(state$: Store<AppState>): Observable<number>        
        ** getSelectedCreditCard(state$: Store<AppState>): Observable<CreditCard>
        
 * Models
    * CreditCard
    * CreditCardSummary 
 
 * Services (`WalletService`) is responsible for Http Requests, dispatching action creators as well managing local cached data.
    * `walletService`:
        - getCard(id: number): Observable<CreditCard>
        - getAllCards(): Observable<CreditCardSummary>
        - createCard(params: ICreditCard): Observable<CreditCardSummary>
        - updateCard(params: ICreditCard): Observable<CreditCardSummary>
        - deleteCard(id: number): Observable<any>        
        - setSelectedCreditCard(card: CreditCard): void
        - getAll(): void
        - addCreateCard(creditCard: CreditCardSummary): void 
        - updateExistingCard(card: CreditCardSummary): void 
        - updateExistingCardFailed(error: string): void
        - updateRemovedCardFulfilled(card: { id: number }): void
        - updateRemovedCardFailed(error: string): void
        - changeCurrentSelectedState(selectedState: string): void
        
 * Effects (for managing your side effects)
 
 * Configure your application with Store({ reducers }), Modules 
 
 * Build Containers/Components/Validators/Routes/Utils 
 
 
 ### Backend 
 * express app with different api end points exposed to it 
 * serves up static assets and route to api endpoints 
 * endpoints: 
    * '/api/wallet/create'
    * '/api/wallet/get'
    * '/api/wallet/getAll'
    * '/api/wallet/update'
    * '/api/wallet/delete'
 


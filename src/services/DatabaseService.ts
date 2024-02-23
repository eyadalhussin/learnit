import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CollectionReference, Firestore, addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, onSnapshot, query, updateDoc, where, writeBatch } from "firebase/firestore";
import { BehaviorSubject, firstValueFrom } from "rxjs";
import Frage from "src/app/classes/Frage";
import Vorlesung from "src/app/classes/Vorlesung";

@Injectable({providedIn: 'root'})
export default class DatabaseService{
    //Database
    private db: Firestore;
    //CollectionReference
    private collectionRef: CollectionReference;

    //Subjects (Vorlesungen)
    private vorlesungenSubject = new BehaviorSubject<Vorlesung[]>([]);
    vorlesungen$ = this.vorlesungenSubject.asObservable();

    //Vorlesungen count für die Berechnung des IDS
    private vorlesungenCount:number = 0;

    constructor(private http:HttpClient){
        this.db = getFirestore();
        this.collectionRef = collection(this.db, 'Vorlesungen');
        this.initVorlesungen();
    }

    async initVorlesungen(){
        //Get the Collection of the **Vorlesungen**
        const vorlesungenCollection = collection(this.db, 'Vorlesungen');
        onSnapshot(vorlesungenCollection, (vorlesungenSnapshot) => {
            //Empty Array to store the data
            const vorlesungenArray:Vorlesung[] = [];

            vorlesungenSnapshot.forEach((doc) => {
                const vorlesungenData = doc.data();
                const questionsArray: Frage[] = [];
            
                const questionsCollection = collection(this.db, `Vorlesungen/${doc.id}/Fragen`);

                onSnapshot(questionsCollection, (questionsSnapshot) => {
                    questionsArray.length = 0;
                    questionsSnapshot.forEach((doc) => {
                        const questionData = doc.data();
                        questionsArray.push(new Frage(questionData['id'],questionData['Beschreibung'], questionData['Frage'], questionData['Antwort']));
                    });
                });
                questionsArray.sort((a,b) => a.id - b.id);
                vorlesungenArray.push(new Vorlesung(vorlesungenData['id'], vorlesungenData['Name'], questionsArray));
            });
            vorlesungenArray.sort((a,b) => a.id - b.id);
            this.vorlesungenCount = vorlesungenArray.length;
            this.vorlesungenSubject.next(vorlesungenArray);
        });
    }

    getCurrentSubjects():Vorlesung[]{
        return this.vorlesungenSubject.getValue();
    }

    async addNewSubject(name:string){
        const vorlesungenCollection = collection(this.db, 'Vorlesungen');
        const neueVorlesung = await addDoc(vorlesungenCollection, {id: this.vorlesungenCount + 1, Name: name});
    }

    async updateQuestion(question: Frage, vorlesung:Vorlesung){
        const vorlesungRef = await this.getSubjectReferenceByID(vorlesung.id);
        const fragenRef = collection(vorlesungRef, 'Fragen');
        const fragenQuery = query(fragenRef, where('id','==',question.id));
        const fragenSnapshot = await getDocs(fragenQuery);

        if(!fragenSnapshot.empty){
            const frageDocRef = fragenSnapshot.docs[0].ref;
            await updateDoc(frageDocRef, {
                id: question.id,
                Beschreibung: question.beschreibung,
                Frage: question.frageStellung,
                Anwort: question.antwort
            });
        } else {
            throw new Error("Keine Frage mit dieser ID gefunden");
        }
    }

    async addNewQuestionToSubject(vorlesung:Vorlesung, newQuestion: Frage){
        const vorlesungRef = await this.getSubjectReferenceByID(vorlesung.id);
        const fragenRef = collection(vorlesungRef, 'Fragen');
        addDoc(fragenRef, {
            id: newQuestion.id,
            Beschreibung: newQuestion.beschreibung,
            Frage: newQuestion.frageStellung,
            Antwort: newQuestion.antwort
        }).catch(error => {
            throw new Error("Frage nicht hinzugefügt, ein Fehler ist aufgetreten !");
        })
    }

    async getQuestionsFromJsonFile(jsonUrl:string) : Promise<Frage[]>{
        const questions: Frage[] = [];
        let id = 0;
        this.http.get<any>(jsonUrl)
        .subscribe(
            (erg:any) => {
                erg.forEach((element:any) => {
                    questions.push(new Frage(++id, element.beschreibung, element.frage, element.antwort));
                });
            }
            );
        return questions;
    }

    async addMultipleQuestionsToSubjectFromJson(jsonUrl: string, subjectID: number) {
        try {
            const questionsResponse = await firstValueFrom(this.http.get<Frage[]>(jsonUrl));
            const questions: Frage[] = questionsResponse.map((element, index) => new Frage(index + 1, element.beschreibung, element.frageStellung, element.antwort));
    
            const vorlesungRef = await this.getSubjectReferenceByID(subjectID);
            const fragenRef = collection(vorlesungRef, 'Fragen');
            const snapshot = await getDocs(fragenRef);
            let fragenCount = snapshot.docs.length;
    
            const batch = writeBatch(this.db);
    
            questions.forEach(question => {
                const frageDocRef = doc(fragenRef); // Lässt Firestore eine neue ID generieren, oder Sie können eine eigene Logik zur ID-Generierung implementieren
                batch.set(frageDocRef, {
                    id: ++fragenCount,
                    Beschreibung: question.beschreibung,
                    Frage: question.frageStellung,
                    Antwort: question.antwort
                });
            });
    
            await batch.commit();
        } catch (error) {
            console.error("Ein Fehler ist aufgetreten beim Hinzufügen der Fragen:", error);
            throw new Error("Ein Fehler ist aufgetreten beim Hinzufügen der Fragen.");
        }
    }

    // async addMultipleQuestionsToSubjectFromJson(jsonUrl:string, subjectID:number){
    //     try{
    //         const questions: Frage[] = [];
    //         let id = 0;
    //         this.http.get<any>(jsonUrl)
    //         .subscribe(
    //             (erg:any) => {
    //                 erg.forEach((element:any) => {
    //                     questions.push(new Frage(++id, element.beschreibung, element.frage, element.antwort));
    //                 });
    //             }
    //         );
    //         //Get the Questions and their length to determine the next ID
    //         const vorlesungRef = await this.getSubjectReferenceByID(subjectID);
    //         const fragenRef = collection(vorlesungRef, 'Fragen');
    //         let fragenCount = 0;
    //         await getDocs(fragenRef).then(snapshot => {
    //             fragenCount = snapshot.docs.length;
    //         });
    
    //         const batch = writeBatch(this.db);
    
    //         questions.forEach(question => {
    //             const frageDocRef = doc(fragenRef);
    //             batch.set(frageDocRef, {
    //                 id: ++fragenCount,
    //                 Beschreibung: question.beschreibung,
    //                 Frage: question.frageStellung,
    //                 Antwort: question.antwort
    //             });
    //         });
            
    //         await batch.commit();  
    //     } catch(error){
    //         console.log(error);
    //         throw new Error("Ein Fehler ist aufgetreten beim Hinzufügen der Fragen.");
    //     }
    // }

    async deleteQuestionBySubject(question:Frage, vorlesung: Vorlesung){
        const vorlesungRef = await this.getSubjectReferenceByID(vorlesung.id);
        const fragenRef = collection(vorlesungRef, 'Fragen');
        const fragenQuery = query(fragenRef, where('id', '==', question.id));
        const querySnapshot = await getDocs(fragenQuery);

        if(!querySnapshot.empty){
            const frageDocRef = querySnapshot.docs[0].ref;
            deleteDoc(frageDocRef);
        } else {
            throw new Error("Frage nicht gefunden !");
        }
    }

    async getSubjectReferenceByID(vorlesungID: number){
        const vorlesungenRef = collection(this.db, 'Vorlesungen');
        const vorlesungQuery = query(vorlesungenRef, where('id', '==', vorlesungID));

        const querySnapshot = await getDocs(vorlesungQuery);

        if(!querySnapshot.empty){
            return querySnapshot.docs[0].ref;
        }
        else {
            throw new Error('Keine Vorlesung mit diesem ID gefunden');
        }
    }
}
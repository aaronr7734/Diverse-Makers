//
//  ContentView.swift
//  Prototype
//
//  Created by Kane Davidson on 5/3/24.
//

import SwiftUI

struct ContentView: View {
    @State private var searchtext : String = ""
    var body: some View {
        NavigationStack {
            VStack {
                HStack {
                    Text(Date.now, format: .dateTime.day().month().year())
                    Spacer()
                }
                HStack {
                    Text("Create Awesomeness")
                        .font(.title)
                        .fontWeight(.bold)
                    Spacer()
                    NavigationLink( destination: AccountView()) {
                        
                        Image(systemName: "person.crop.circle.fill")
                            .imageScale(.large)
                            .foregroundStyle(.tint)
                    }
                }
                SearchBar(text: .constant(""))
                
                // list of projects
                Projects()
                
                Spacer()
                    .toolbar {
                        ToolbarItem (placement: .bottomBar) {
                            Button {print("Toolbar button pressed")} label: {Text("For you")}
                        }
                        ToolbarItem (placement: .bottomBar) {
                            NavigationLink( destination: MapView()) {
                                Text("Local Makerspaces")
                            }
                        }
                    }
                        
                    }
            }
            .padding()
        }
    }


#Preview {
    ContentView()
}

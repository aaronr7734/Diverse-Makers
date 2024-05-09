//
//  Projects.swift
//  Prototype
//
//  Created by Kane Davidson on 5/7/24.
//

import SwiftUI

struct Projects: View {
    var body: some View {
        List {
            NavigationLink(destination: ProjectDescription()) {
                Image("pic1")
                    .resizable(resizingMode: .stretch)
                    .aspectRatio(contentMode: .fit)
                Text("Project 1")
            }
            NavigationLink(destination: ProjectDescription()) {
                Image("pic2")
                    .resizable(resizingMode: .stretch)
                    .aspectRatio(contentMode: .fit)
                Text("Project 2")
            }
            NavigationLink(destination: ProjectDescription()) {
                Image("pic3")
                    .resizable(resizingMode: .stretch)
                    .aspectRatio(contentMode: .fit)
                Text("Project 3")
            }
        }
    }
}

#Preview {
    Projects()
}

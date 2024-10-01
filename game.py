import random

# Define player roles
class Player:
    def __init__(self, name, role):
        self.name = name
        self.role = role
        self.alive = True

    def __str__(self):
        return f"{self.name} ({'Alive' if self.alive else 'Dead'}) - Role: {self.role}"

# Roles and actions
def assign_roles(players):
    random.shuffle(players)
    num_mafia = len(players) // 3
    roles = ['Mafia'] * num_mafia + ['Doctor', 'Detective'] + ['Townsperson'] * (len(players) - num_mafia - 2)
    random.shuffle(roles)

    for player, role in zip(players, roles):
        player.role = role

def night_phase(players, mafia, doctor, detective):
    print("\nNight falls...")
    mafia_target = random.choice([p for p in players if p.alive and p != mafia])
    doctor_choice = random.choice([p for p in players if p.alive])
    detective_choice = random.choice([p for p in players if p.alive and p != detective])
    
    # Mafia attempts to kill someone
    if mafia_target != doctor_choice:
        mafia_target.alive = False
        print(f"{mafia_target.name} was killed by the Mafia.")
    else:
        print(f"{mafia_target.name} was protected by the Doctor!")
    
    # Detective investigates
    print(f"Detective investigates {detective_choice.name}: {detective_choice.role}")

def day_phase(players):
    print("\nDay comes... Time to vote!")
    alive_players = [p for p in players if p.alive]
    for i, player in enumerate(alive_players):
        print(f"{i+1}. {player.name} ({'Alive'})")
    
    suspect_idx = int(input("Who do you vote to eliminate? (Enter number): ")) - 1
    suspect = alive_players[suspect_idx]
    suspect.alive = False
    print(f"{suspect.name} was voted out by the town.")

def check_game_over(players):
    mafia_alive = [p for p in players if p.alive and p.role == 'Mafia']
    townspeople_alive = [p for p in players if p.alive and p.role != 'Mafia']

    if not mafia_alive:
        print("The Mafia have been eliminated. Townspeople win!")
        return True
    elif len(mafia_alive) >= len(townspeople_alive):
        print("The Mafia outnumber the Townspeople. Mafia win!")
        return True
    return False

# Main game loop
def mafia_game():
    print("Welcome to Mafia!")
    player_names = input("Enter player names, separated by commas: ").split(',')
    players = [Player(name.strip(), None) for name in player_names]
    
    assign_roles(players)
    for player in players:
        print(player)

    mafia = next(p for p in players if p.role == 'Mafia')
    doctor = next(p for p in players if p.role == 'Doctor')
    detective = next(p for p in players if p.role == 'Detective')

    game_over = False
    while not game_over:
        night_phase(players, mafia, doctor, detective)
        game_over = check_game_over(players)
        if game_over:
            break
        day_phase(players)
        game_over = check_game_over(players)

mafia_game()
